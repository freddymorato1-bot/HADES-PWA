# SECURITY

- Default deny for unsafe tool categories.
- All tool access is evaluated through a local Policy Engine.
- Remote destinations must be allowlisted and explicit.
- No eval/new Function usage is present in the app code.
- Automation cannot alter the Policy Engine or override security rules.
