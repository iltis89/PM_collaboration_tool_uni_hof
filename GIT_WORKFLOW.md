# Git Workflow & Branching Strategy

This project follows a professional **Feature Branch Workflow** adapted for Vercel deployments.

## Branching Strategy

| Branch | Environment | URL | Purpose |
|--------|-------------|-----|---------|
| `main` | **Production** | [Production URL] | Stable, production-ready code. |
| `development` | **Preview/Staging** | [Preview URL] | Integration branch for testing new features and debugging. |
| `feature/*` | Local | - | Temporary branches for specific features (e.g., `feature/exam-logic`). |
| `fix/*` | Local | - | Temporary branches for bug fixes (e.g., `fix/login-error`). |

## Workflow Steps

1.  **Start a new feature**:
    ```bash
    git checkout development
    git pull origin development
    git checkout -b feature/my-new-feature
    ```
2.  **Develop & Commit**:
    - Make changes and commit often.
    - Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add login`, `fix: resolve crash`).
3.  **Merge to Development (Staging)**:
    - Push your feature branch: `git push origin feature/my-new-feature`
    - Open a Pull Request (PR) to `development`.
    - **Vercel** will automatically deploy a preview.
    - Verify changes on the preview URL.
4.  **Release to Main (Production)**:
    - Once `development` is stable and verified.
    - Open a PR from `development` to `main`.
    - Merging to `main` triggers a **Production Deployment**.

## Commit Convention

Use the following prefixes for commit messages:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `chore:` Maintenance (dependencies, build scripts)
- `refactor:` Code refactoring without functionality changes
- `style:` Formatting, missing semi-colons, etc.

**Example**:
```bash
git commit -m "feat: add hierarchical exam locking logic"
```
