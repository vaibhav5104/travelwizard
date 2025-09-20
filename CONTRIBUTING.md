# Contributing to Travel Wizard

Thank you for your interest in contributing to Travel Wizard! We welcome contributions from the community and are grateful for your help in making this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally: `git clone https://github.com/vaibhav5104/travelwizard.git`
3. Create a new branch for your changes: `git checkout -b feature/your-feature-name`
4. Make your changes and test them thoroughly
5. Commit your changes with a clear commit message
6. Push to your fork and submit a pull request

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**: Help us identify and fix issues
- **Feature development**: Implement new features or enhancements
- **Documentation**: Improve or add documentation
- **Testing**: Add or improve test coverage
- **Code review**: Review pull requests from other contributors
- **Issue triage**: Help categorize and prioritize issues

### First Time Contributors

Look for issues labeled `good first issue` or `beginner-friendly`. These are specifically curated for new contributors and provide a good starting point.

## Development Setup

### Prerequisites

- [List required software/tools](README.md)
- [Specify versions if important](SECURITY.md)

### Local Development

```bash
# Clone the repository
git clone https://github.com/vaibhav5104/travelwizard.git
cd travelwizard

# Install dependencies
cd server
npm install

cd ../client
npm install


# Run the development server
cd ../server
# Use nodemon for auto-reload on changes
npx nodemon server.js

cd ../client
npm run dev

```
### Optional Tips

- Open two terminal tabs: one for server and one for client.
- Make sure .env files (if any) in server or client are configured correctly.

### Environment Configuration

1. Copy the example environment file: `cp .env.example .env`
2. Update the configuration values as needed

## Coding Standards

### Code Style

- Use meaningful variable and function names
- Write clear, concise comments
- Keep functions small and focused on a single responsibility

## Testing

### Writing Tests

- Write tests for all new features and bug fixes
- Maintain or improve test coverage
- Use descriptive test names that explain what is being tested
- Follow the existing test patterns and structure

### Test Requirements

- All new code should have accompanying tests
- Tests should pass on all supported platforms
- Integration tests should be included for new features

## Submitting Changes

### Pull Request Process

1. **Create a focused PR**: Each pull request should address a single issue or feature
2. **Write a clear description**: Explain what your changes do and why
3. **Reference issues**: Link to any relevant issues using `Fixes #123` or `Closes #123`
4. **Update documentation**: Include any necessary documentation updates
5. **Add tests**: Ensure your changes are covered by tests

### Pull Request Template

When creating a pull request, please include:

- **Summary**: Brief description of changes
- **Type of change**: Bug fix, new feature, documentation, etc.
- **Testing**: How you tested your changes
- **Checklist**: Confirm you've followed the contribution guidelines

### Review Process

- All submissions require review from project maintainers
- We may suggest changes, improvements, or alternatives
- Once approved, a maintainer will merge your pull request
- Please be patient during the review process and responsive to feedback

## Reporting Issues

### Before Reporting

1. Make sure you're using the latest version
2. Try to reproduce the issue with minimal steps

### Issue Template

When reporting bugs, please include:

- **Environment**: OS, browser, version numbers
- **Steps to reproduce**: Detailed steps that trigger the issue
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Additional context**: Screenshots, error messages, etc.

## Feature Requests

We welcome feature requests! Please:

1. Check if a similar request already exists
2. Clearly describe the feature and its use case
3. Explain how it would benefit the project and users
4. Be open to discussion and alternative approaches

## Community

### Getting Help

- **Documentation**: Check our [README File](README.md)
- **Issues**: Ask questions by opening an issue with the `question` label

### Stay Updated

- Watch the repository for updates
- Follow our major announcements
- Join our community channels for discussions

## Recognition

We appreciate all contributions and recognize contributors in:

- Release notes for significant contributions
- Social media shout-outs for outstanding contributions

## Questions?

If you have questions about contributing, please:

1. Check this guide first
2. Search existing issues and discussions
3. Open a new issue with the `question` label
4. Reach out to maintainers on [gmail](vaibhavsharma5104@gmail.com)

Thank you for contributing to Travel Wizard! 🎉
