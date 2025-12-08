# Structurizr DSL Quick Reference

This guide provides quick examples for editing the `workspace.dsl` file.

## Basic Structure

```dsl
workspace "Name" "Description" {
    model {
        # Define people, systems, containers, components
    }
    
    views {
        # Define which diagrams to generate
    }
}
```

## Model Elements

### People (Actors)

```dsl
customer = person "Customer" "Description of who they are and what they do"
```

### Software Systems

```dsl
# Internal system
mySystem = softwareSystem "My System" "What it does"

# External system
externalSystem = softwareSystem "External System" "What it does" {
    tags "External System"
}
```

### Containers (Applications/Services)

```dsl
mySystem = softwareSystem "My System" {
    webapp = container "Web App" "Description" "Technology"
    api = container "API" "Description" "Technology"
    database = container "Database" "Description" "Technology" {
        tags "Database"
    }
}
```

### Components (Modules within Containers)

```dsl
api = container "API" {
    authModule = component "Authentication" "Handles user auth" "Django App"
    userModel = component "User Model" "User data" "Django Model"
}
```

## Relationships

### Basic Relationship

```dsl
source -> destination "Description"
```

### Relationship with Technology

```dsl
frontend -> backend "Makes API calls" "HTTPS/REST"
```

### Component Relationships

```dsl
# Within the same container
componentA -> componentB "Uses"

# Across containers
container1.componentA -> container2.componentB "Calls"
```

## Views

### System Context View

Shows the big picture with external actors and systems:

```dsl
systemContext mySystem "DiagramKey" {
    include *
    autoLayout lr  # lr = left-right, tb = top-bottom
    description "Optional description"
}
```

### Container View

Shows applications/services within a system:

```dsl
container mySystem "DiagramKey" {
    include *
    autoLayout lr
}
```

### Component View

Shows internal modules within a container:

```dsl
component mySystem.api "DiagramKey" {
    include *
    autoLayout tb
}
```

### Dynamic View

Shows a sequence of interactions:

```dsl
dynamic mySystem "DiagramKey" "Description" {
    user -> webapp "1. First action"
    webapp -> api "2. Second action"
    api -> database "3. Third action"
    autoLayout lr
}
```

## Styling

### Element Styles

```dsl
styles {
    element "Person" {
        shape person
        background #08427b
        color #ffffff
    }
    
    element "Software System" {
        background #1168bd
        color #ffffff
        shape RoundedBox
    }
    
    element "Database" {
        shape cylinder
        background #438dd5
    }
    
    element "External System" {
        background #999999
    }
}
```

### Available Shapes

- `Box` (default)
- `RoundedBox`
- `Circle`
- `Ellipse`
- `Hexagon`
- `Cylinder`
- `Component`
- `Person`
- `Robot`
- `Folder`
- `WebBrowser`
- `MobileDevicePortrait`
- `MobileDeviceLandscape`
- `Pipe`

### Colors

Use hex colors: `#1168bd`, `#ffffff`, etc.

## Tags

Tags allow you to apply styles to multiple elements:

```dsl
# Assign tag
myElement = softwareSystem "Name" {
    tags "External System"
}

# Style by tag
styles {
    element "External System" {
        background #999999
    }
}
```

### Common Tags

- `External System` - Third-party systems
- `Database` - Database containers
- `Web Browser` - Frontend applications
- `Mobile App` - Mobile applications

## Identifiers

Use hierarchical identifiers for cleaner references:

```dsl
workspace {
    !identifiers hierarchical
    
    model {
        mySystem = softwareSystem "My System" {
            api = container "API" {
                auth = component "Auth"
            }
        }
        
        # Reference: mySystem.api.auth instead of just auth
    }
}
```

## Common Patterns for This Project

### Adding a New Django App

```dsl
# In djangoAPI container
newApp = component "New App" "App description" "Django App"
newModel = component "New Model" "Model description" "Django Model"
newViews = component "New Views" "API endpoints" "DRF ViewSets"

# Add relationships
apiRouter -> newApp "Routes requests to"
newViews -> newModel "Queries"
```

### Adding a New React Module

```dsl
# In reactApp container
newModule = component "New Module" "Module description" "React Components"
newView = component "New View" "View description" "React Component"

# Add relationships
newModule -> apiClient "Uses"
newView -> newModule "Part of"
apiClient -> djangoAPI.newViews "Calls endpoints"
```

### Adding an External Service

```dsl
# In model (top level)
newService = softwareSystem "Service Name" "What it does" {
    tags "External System"
}

# Add relationships
ecommerceSystem -> newService "Integration description"
djangoAPI -> newService "How it's used" "API Protocol"
```

## Tips

1. **Be Consistent**: Use consistent naming conventions (camelCase for identifiers)
2. **Use Descriptions**: Every element should have a meaningful description
3. **Keep It Simple**: Don't model every single class or function
4. **Focus on Architecture**: Model architectural decisions, not implementation details
5. **Use AutoLayout**: Let Structurizr handle positioning with `autoLayout`
6. **Comment Your Code**: Use `#` for comments to explain complex sections
7. **Test Frequently**: Save and refresh browser often to catch errors early

## Validation

Structurizr will show errors in the browser if your DSL is invalid:
- Missing required properties
- Invalid relationship references
- Syntax errors

Check the browser console and Structurizr logs for details.

## Export Options

From the Structurizr UI, you can export:
- **PNG**: Raster images for documents
- **SVG**: Vector graphics for scaling
- **PlantUML**: Alternative format for other tools

## Resources

- [Full DSL Reference](https://docs.structurizr.com/dsl/language)
- [DSL Cookbook](https://docs.structurizr.com/dsl/cookbook)
- [Example Workspace](https://docs.structurizr.com/dsl/example)
- [C4 Model Guide](https://c4model.com/)
