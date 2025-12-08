# Structurizr Lite Command Cheat Sheet

Quick reference for common Structurizr Lite commands and workflows.

## Docker Commands

### Start Structurizr Lite
```bash
# Standard command
docker run -it --rm -p 8080:8080 \
  -v /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture:/usr/local/structurizr \
  structurizr/lite

# Run in background (detached mode)
docker run -d --rm -p 8080:8080 \
  --name structurizr \
  -v /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture:/usr/local/structurizr \
  structurizr/lite
```

### Use a Different Port (if 8080 is taken)
```bash
# Map to port 8081
docker run -it --rm -p 8081:8080 \
  -v /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture:/usr/local/structurizr \
  structurizr/lite

# Then access at http://localhost:8081
```

### Stop Structurizr Lite
```bash
# If running in foreground (interactive mode)
# Press Ctrl+C in the terminal

# If running in background
docker stop structurizr
```

### Check Running Containers
```bash
docker ps
```

### View Structurizr Logs
```bash
# If running in background
docker logs structurizr

# Follow logs in real-time
docker logs -f structurizr
```

### Update Structurizr Lite Image
```bash
docker pull structurizr/lite
```

## File Operations

### Backup Current Workspace
```bash
cd /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture
cp workspace.dsl workspace.dsl.backup-$(date +%Y%m%d-%H%M%S)
```

### Validate DSL Syntax (via Docker)
```bash
# Structurizr will validate on load
# Check browser console for errors
```

### View Workspace File
```bash
cd /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture
cat workspace.dsl
```

## Git Commands

### Commit Architecture Changes
```bash
cd /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce

# Add architecture files
git add docs/architecture/workspace.dsl
git add docs/architecture/README.md
git add docs/architecture/DSL_GUIDE.md

# Commit
git commit -m "docs: update architecture diagrams"

# Push
git push
```

### View Architecture Changes
```bash
# See what changed
git diff docs/architecture/workspace.dsl

# View file history
git log --oneline docs/architecture/workspace.dsl
```

## Browser Access

### Open Structurizr UI
- URL: http://localhost:8080
- (or your custom port if changed)

### Navigate Diagrams
- Click diagram names in the left sidebar
- Use navigation buttons in the UI
- Click elements to highlight relationships

### Export Diagrams
1. Select a diagram
2. Click download icon (camera) in top right
3. Choose format: PNG or SVG

## Workflow

### Daily Development Flow
```bash
# 1. Start Structurizr
docker run -it --rm -p 8080:8080 \
  -v /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture:/usr/local/structurizr \
  structurizr/lite

# 2. Open browser
open http://localhost:8080

# 3. Edit workspace.dsl in your editor
# (Structurizr auto-reloads every 5 seconds)

# 4. When done, stop Docker (Ctrl+C)

# 5. Commit changes
git add docs/architecture/workspace.dsl
git commit -m "docs: [describe architecture change]"
```

### Quick Edit Flow
```bash
# Open workspace file
code /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture/workspace.dsl

# Make changes
# Save (Cmd+S or Ctrl+S)
# Refresh browser to see updates
```

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process (if safe)
kill -9 <PID>

# Or use a different port
docker run -it --rm -p 8081:8080 ...
```

### Container Won't Start
```bash
# Check Docker is running
docker ps

# Check Docker logs
docker logs <container-id>

# Remove old containers
docker container prune

# Pull fresh image
docker pull structurizr/lite
```

### Workspace Won't Load
```bash
# Check file exists
ls -la /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture/workspace.dsl

# Check file permissions
chmod 644 workspace.dsl

# Check for syntax errors
# View browser console (F12)
# Check Docker logs
```

### Changes Not Showing
- Refresh browser (Cmd+R or F5)
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
- Check file was saved
- Wait 5 seconds (auto-reload interval)
- Check for DSL syntax errors in browser console

## Useful Keyboard Shortcuts (in Browser)

- **F11**: Fullscreen mode
- **Cmd/Ctrl + Plus/Minus**: Zoom in/out
- **Cmd/Ctrl + 0**: Reset zoom
- **F12**: Open browser console (to see errors)

## Environment-Specific Paths

### macOS (Current)
```bash
/Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture
```

### If You Move the Project
Update the `-v` volume mount path:
```bash
docker run -it --rm -p 8080:8080 \
  -v /path/to/your/project/docs/architecture:/usr/local/structurizr \
  structurizr/lite
```

### Windows (for reference)
```bash
docker run -it --rm -p 8080:8080 \
  -v C:\path\to\project\docs\architecture:/usr/local/structurizr \
  structurizr/lite
```

### Linux (for reference)
```bash
docker run -it --rm -p 8080:8080 \
  -v /home/user/project/docs/architecture:/usr/local/structurizr \
  structurizr/lite
```

## Quick Tips

1. **Keep Docker running while editing**: Auto-reload makes it seamless
2. **Use version control**: Commit architecture changes regularly
3. **Export important diagrams**: Save PNG/SVG versions for presentations
4. **Reference documentation**: Check DSL_GUIDE.md for syntax help
5. **Start simple**: Begin with high-level views, add detail gradually
6. **Use comments**: Add `#` comments in DSL to explain decisions
7. **Test incrementally**: Save and refresh often to catch errors early

## Resources

- Local README: `docs/architecture/README.md`
- DSL Guide: `docs/architecture/DSL_GUIDE.md`
- Structurizr Docs: https://docs.structurizr.com/
- DSL Reference: https://docs.structurizr.com/dsl/language

## Support

For issues or questions:
- Check browser console (F12) for errors
- Review Docker logs: `docker logs structurizr`
- Check Structurizr docs: https://docs.structurizr.com/lite
- Review DSL syntax: https://docs.structurizr.com/dsl/language
