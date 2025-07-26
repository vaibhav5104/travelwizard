from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

app = FastAPI()

# Allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/events/{city}")
def get_events(city: str):
    return {"events": scrape_events(city)}

def scrape_events(city):
    url = f"https://in.bookmyshow.com/explore/events-{city}"

    # Set up Selenium WebDriver
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)

    events = []

    try:
        # Wait for events to load
        WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a.sc-133848s-11.sc-1ljcxl3-1"))
        )

        event_elements = driver.find_elements(By.CSS_SELECTOR, "a.sc-133848s-11.sc-1ljcxl3-1")

        for event in event_elements[:8]:
            try:
                event_link = event.get_attribute("href")
                img_tag = event.find_element(By.CSS_SELECTOR, "img")
                img_url = img_tag.get_attribute("src")
                event_name = img_tag.get_attribute("alt")

                details = event.find_elements(By.CSS_SELECTOR, "div.sc-7o7nez-0")
                event_location = details[1].text if len(details) > 1 else "N/A"
                event_category = details[2].text if len(details) > 2 else "N/A"
                event_price = details[3].text if len(details) > 3 else "N/A"

                events.append({
                    "name": event_name,
                    "image": img_url,
                    "link": event_link,
                    "location": event_location,
                    "category": event_category,
                    "price": event_price
                })
            except Exception as inner_err:
                # Optionally log inner_err for debugging
                continue

    except Exception as outer_err:
        events = [{"error": f"Failed to load events: {str(outer_err)}"}]

    finally:
        driver.quit()

    return events
