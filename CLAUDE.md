# GT Studio — Claude Instructions

## After every UI or functionality change

Run the full Playwright suite before considering the task done:

```bash
npx playwright test
```

If tests fail, fix the issue and re-run until all pass. If a change introduces a new visual or behavioral requirement not yet covered by a test, write a Playwright spec for it in `e2e/` before pushing.

Make sure the dev server running on port 5173 is serving the current working directory (not a stale worktree). Check with:

```bash
lsof -p $(lsof -ti :5173) | grep cwd
```

If it's pointing at a worktree, kill it and restart from the project root.
