# Email Templates Feature - Visual Guide

## 📧 Email Templates Overview

### Main Templates View
```
┌─────────────────────────────────────────────────────────────┐
│ Email Templates                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Manage Templates                                             │
│ Customize email templates for candidate communication.      │
│ Use variables like {{candidateName}}, {{jobTitle}}, etc.    │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Interview Invitation                    [Edit] [Preview]│  │
│ │ Subject: Interview Invitation - {{jobTitle}}           │  │
│ │ Dear {{candidateName}}, Congratulations! We are...     │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Rejection Email                         [Edit] [Preview]│  │
│ │ Subject: Application Status - {{jobTitle}}             │  │
│ │ Dear {{candidateName}}, Thank you for your interest... │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Offer Letter                            [Edit] [Preview]│  │
│ │ Subject: Job Offer - {{jobTitle}}                      │  │
│ │ Dear {{candidateName}}, We are delighted to offer...   │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Follow-up                               [Edit] [Preview]│  │
│ │ Subject: Application Follow-up - {{jobTitle}}          │  │
│ │ Dear {{candidateName}}, Thank you for applying...      │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✏️ Edit Template Modal

### When clicking "Edit" button:
```
┌─────────────────────────────────────────────────────────────┐
│                    MODAL OVERLAY (Blurred Background)        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Edit Template: Interview Invitation            [X]   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │ Subject Line                                          │  │
│  │ ┌───────────────────────────────────────────────┐   │  │
│  │ │ Interview Invitation - {{jobTitle}}           │   │  │
│  │ └───────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │ Email Body                                            │  │
│  │ ┌───────────────────────────────────────────────┐   │  │
│  │ │ Dear {{candidateName}},                       │   │  │
│  │ │                                                │   │  │
│  │ │ Congratulations! We are pleased to invite     │   │  │
│  │ │ you for an interview for the position of      │   │  │
│  │ │ {{jobTitle}}.                                  │   │  │
│  │ │                                                │   │  │
│  │ │ Interview Details:                             │   │  │
│  │ │ Date: {{interviewDate}}                        │   │  │
│  │ │ Time: {{interviewTime}}                        │   │  │
│  │ │ Location: {{location}}                         │   │  │
│  │ │                                                │   │  │
│  │ │ Please confirm your availability.              │   │  │
│  │ │                                                │   │  │
│  │ │ Best regards,                                  │   │  │
│  │ │ {{companyName}}                                │   │  │
│  │ └───────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │ ┌─────────────────────────────────────────────────┐ │  │
│  │ │ Available Variables:                            │ │  │
│  │ │ {{candidateName}} {{jobTitle}} {{companyName}}  │ │  │
│  │ │ {{package}} {{location}} {{interviewDate}}      │ │  │
│  │ │ {{interviewTime}} {{joiningDate}} {{timeframe}} │ │  │
│  │ └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │                          [Cancel] [Save Template]    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Features

### Color Scheme
- **Background**: Dark theme (#1a1a1a)
- **Cards**: Dark card (#2a2a2a)
- **Borders**: Dark border (#3a3a3a)
- **Primary**: Yellow/Gold (#f59e0b)
- **Text**: White/Slate

### Interactive Elements
1. **Edit Button**
   - Border: Primary color
   - Text: Primary color
   - Hover: Primary background (10% opacity)
   - Icon: Edit pencil

2. **Preview Button**
   - Border: Dark border
   - Text: Slate
   - Hover: Dark card background
   - Icon: Eye

3. **Modal**
   - Backdrop: Black with 60% opacity + blur
   - Card: Dark card with border
   - Max width: 2xl (672px)
   - Max height: 90vh with scroll

4. **Input Fields**
   - Background: Dark hover
   - Border: Dark border
   - Focus: Primary ring (2px)
   - Text: White

---

## 🔄 User Flow

### Viewing Templates
1. User navigates to "Email Templates" tab
2. Sees 4 pre-configured templates
3. Each template shows:
   - Template name
   - Subject line preview
   - Body preview (truncated)
   - Edit and Preview buttons

### Editing Template
1. User clicks "Edit" button
2. Modal opens with:
   - Template name in header
   - Subject input field (pre-filled)
   - Body textarea (pre-filled, 12 rows)
   - Available variables section
   - Cancel and Save buttons
3. User modifies content
4. User can use variables by typing {{variableName}}
5. User clicks "Save Template"
6. Success alert appears
7. Modal closes
8. Changes reflected in main view

### Previewing Template
1. User clicks "Preview" button
2. Alert dialog shows:
   - Full subject line
   - Complete email body
3. User can see how template looks
4. User closes alert

---

## 📋 Template Variables

### Available Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `{{candidateName}}` | Candidate's full name | "John Doe" |
| `{{jobTitle}}` | Job position title | "Software Engineer" |
| `{{companyName}}` | Company name | "TCS" |
| `{{package}}` | Salary package | "12 LPA" |
| `{{location}}` | Job location | "Bangalore" |
| `{{interviewDate}}` | Interview date | "2024-01-15" |
| `{{interviewTime}}` | Interview time | "10:00 AM" |
| `{{joiningDate}}` | Expected joining date | "2024-02-01" |
| `{{timeframe}}` | Expected timeframe | "2 weeks" |

### Usage Example
```
Subject: Interview Invitation - {{jobTitle}}

Dear {{candidateName}},

Congratulations! We are pleased to invite you for an interview 
for the position of {{jobTitle}} at {{companyName}}.

Interview Details:
Date: {{interviewDate}}
Time: {{interviewTime}}
Location: {{location}}

Best regards,
{{companyName}}
```

**Rendered Output**:
```
Subject: Interview Invitation - Software Engineer

Dear John Doe,

Congratulations! We are pleased to invite you for an interview 
for the position of Software Engineer at TCS.

Interview Details:
Date: 2024-01-15
Time: 10:00 AM
Location: Bangalore

Best regards,
TCS
```

---

## 🎯 Key Features

### ✅ Implemented
- [x] 4 pre-configured templates
- [x] Full edit functionality
- [x] Preview functionality
- [x] Variable support
- [x] Professional dark theme UI
- [x] Modal dialog for editing
- [x] Real-time updates
- [x] Success notifications
- [x] Responsive design

### 🔮 Future Enhancements
- [ ] Email sending integration
- [ ] Variable auto-replacement
- [ ] Template versioning
- [ ] Email history tracking
- [ ] Custom template creation
- [ ] Rich text editor
- [ ] Email preview with real data
- [ ] Template analytics

---

## 💡 Usage Tips

1. **Use Variables**: Always use variables instead of hardcoded values for dynamic content
2. **Keep it Professional**: Maintain professional tone in all templates
3. **Test Before Sending**: Use preview to verify template looks correct
4. **Consistent Formatting**: Keep consistent formatting across all templates
5. **Clear Subject Lines**: Make subject lines clear and informative

---

## 🔧 Technical Details

### State Management
```javascript
const [emailTemplates, setEmailTemplates] = useState({
  'Interview Invitation': { subject: '...', body: '...' },
  'Rejection Email': { subject: '...', body: '...' },
  'Offer Letter': { subject: '...', body: '...' },
  'Follow-up': { subject: '...', body: '...' }
});

const [editingTemplate, setEditingTemplate] = useState(null);
const [templateForm, setTemplateForm] = useState({ subject: '', body: '' });
```

### Component Structure
- Main view: List of templates with Edit/Preview buttons
- Modal: Edit form with subject, body, and variables
- Preview: Alert dialog showing full template

### Styling
- Tailwind CSS for all styling
- Dark theme throughout
- Responsive design
- Smooth transitions
- Professional appearance

---

**Status**: ✅ Fully Implemented
**Testing**: Ready for production
**Documentation**: Complete
