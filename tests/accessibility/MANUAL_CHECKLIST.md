# Manual Accessibility Testing Checklist

This checklist covers accessibility tests that require manual verification or cannot be fully automated.

## Screen Reader Testing

### NVDA (Windows)
- [ ] **Homepage Navigation**: NVDA correctly announces page structure and landmarks
- [ ] **Sidebar Navigation**: NVDA reads sidebar contents logically
- [ ] **Search Functionality**: Search input and results are properly announced
- [ ] **Theme Toggle**: Theme switcher state is announced correctly
- [ ] **Font Controls**: Font size controls announce current state and changes
- [ ] **Breadcrumb**: Navigation path is read in correct order
- [ ] **Content Lists**: Folder contents and post lists are navigable

### JAWS (Windows)
- [ ] **Homepage Navigation**: JAWS virtual cursor works correctly
- [ ] **Form Controls**: Search form is accessible via form mode
- [ ] **Interactive Elements**: Buttons and links have clear labels
- [ ] **Dynamic Content**: Live regions announce search results updates
- [ ] **Keyboard Shortcuts**: JAWS quick navigation keys work (H for headings, etc.)

### VoiceOver (macOS/iOS)
- [ ] **Rotor Navigation**: Rotor controls work for headings, links, and landmarks
- [ ] **Mobile Safari**: Touch exploration works correctly on mobile
- [ ] **Gesture Navigation**: Standard gestures navigate content properly
- [ ] **Custom Controls**: Theme and font controls work with VoiceOver

## Zoom and Magnification Testing

### Browser Zoom (up to 400%)
- [ ] **200% Zoom**: All content remains usable and readable
  - Text doesn't overlap or become cut off
  - Interactive elements remain clickable
  - Sidebar remains functional
  - Search interface works correctly
- [ ] **300% Zoom**: Essential functionality is still available
  - Main navigation is reachable
  - Content is readable
  - Form controls are usable
- [ ] **400% Zoom**: Critical tasks can still be completed
  - Basic navigation works
  - Search functionality available
  - Theme toggle accessible

### Windows Magnifier
- [ ] **Magnifier Compatibility**: Content works well with Windows Magnifier
- [ ] **Focus Following**: Magnifier follows keyboard focus correctly
- [ ] **Smooth Scrolling**: Page scrolling works smoothly with magnification

### macOS Zoom
- [ ] **System Zoom**: Content works with macOS system zoom
- [ ] **Follow Focus**: Zoom follows keyboard navigation

## Color and Contrast Testing

### Color Blindness
- [ ] **Deuteranopia (Red-Green)**: Information isn't conveyed by color alone
- [ ] **Protanopia (Red-Green)**: Links and buttons are distinguishable
- [ ] **Tritanopia (Blue-Yellow)**: Status indicators don't rely only on color
- [ ] **Monochromacy**: Site is usable in grayscale

### High Contrast Mode
- [ ] **Windows High Contrast**: Site works in Windows high contrast themes
- [ ] **Custom Contrast**: Users can apply their own high contrast stylesheets
- [ ] **Forced Colors**: Respects CSS forced-colors media query

### Light Sensitivity
- [ ] **Dark Theme**: Dark theme reduces eye strain
- [ ] **Reduced Motion**: Respects prefers-reduced-motion setting
- [ ] **No Flash Content**: No content flashes more than 3 times per second

## Motor Impairment Testing

### Mouse-Free Navigation
- [ ] **Keyboard Only**: All functionality available via keyboard
- [ ] **Tab Order**: Logical tab order throughout all pages
- [ ] **Focus Indicators**: Clear visual focus indicators on all interactive elements
- [ ] **Skip Links**: Skip navigation links work correctly

### Motor Precision
- [ ] **Large Click Targets**: Interactive elements are at least 44x44px
- [ ] **Button Spacing**: Adequate spacing between clickable elements
- [ ] **Drag and Drop**: No functionality requires drag and drop
- [ ] **Hover Dependencies**: No functionality requires precise hover

### Switch Navigation
- [ ] **Single Switch**: Site can be navigated with scanning
- [ ] **Two Switch**: Forward/backward navigation works
- [ ] **Dwell Time**: Reasonable time for activation

## Cognitive Accessibility

### Content Clarity
- [ ] **Plain Language**: Content uses clear, simple language
- [ ] **Consistent Navigation**: Navigation is consistent across pages
- [ ] **Clear Instructions**: Form instructions are clear and helpful
- [ ] **Error Prevention**: Forms prevent common errors

### Time and Session Management
- [ ] **No Time Limits**: No unexpected time limits on reading or interaction
- [ ] **Session Persistence**: User preferences persist across sessions
- [ ] **Autosave**: Form data is preserved if possible

### Comprehension Support
- [ ] **Headings Structure**: Clear heading hierarchy aids comprehension
- [ ] **List Formatting**: Information is well-organized in lists
- [ ] **Search Functionality**: Search helps users find content
- [ ] **Breadcrumbs**: Clear indication of current location

## Device and Browser Testing

### Mobile Devices
- [ ] **iOS Safari**: Full functionality on iPhone/iPad
- [ ] **Android Chrome**: Works correctly on Android devices
- [ ] **Voice Control**: Compatible with Voice Control/Voice Access
- [ ] **Switch Control**: Works with iOS Switch Control

### Assistive Technology
- [ ] **Dragon NaturallySpeaking**: Voice control commands work
- [ ] **Eye Tracking**: Compatible with eye tracking software
- [ ] **Alternative Keyboards**: On-screen keyboards work correctly

## Network and Performance

### Low Bandwidth
- [ ] **Slow Connections**: Site remains usable on slow connections
- [ ] **Progressive Enhancement**: Core functionality works without JavaScript
- [ ] **Graceful Degradation**: Features degrade gracefully

### Offline Functionality
- [ ] **Service Worker**: Offline pages provide meaningful feedback
- [ ] **Cached Content**: Previously visited content remains accessible

## Testing Results

### Date: ___________
### Tester: ___________

#### Screen Reader Results
- NVDA: ⭕ Pass / ❌ Fail
- JAWS: ⭕ Pass / ❌ Fail  
- VoiceOver: ⭕ Pass / ❌ Fail

#### Zoom/Magnification Results
- 200% Zoom: ⭕ Pass / ❌ Fail
- 300% Zoom: ⭕ Pass / ❌ Fail
- 400% Zoom: ⭕ Pass / ❌ Fail

#### Color/Contrast Results
- Color Blindness: ⭕ Pass / ❌ Fail
- High Contrast: ⭕ Pass / ❌ Fail

#### Motor Impairment Results
- Keyboard Only: ⭕ Pass / ❌ Fail
- Switch Navigation: ⭕ Pass / ❌ Fail

#### Mobile Results
- iOS: ⭕ Pass / ❌ Fail
- Android: ⭕ Pass / ❌ Fail

### Issues Found:
1. ________________________________
2. ________________________________
3. ________________________________

### Recommendations:
1. ________________________________
2. ________________________________
3. ________________________________

## Testing Tools and Resources

### Browser Extensions
- axe DevTools
- WAVE (Web Accessibility Evaluation Tool)
- Lighthouse Accessibility Audit
- Color Oracle (color blindness simulation)

### Desktop Tools
- NVDA (Free screen reader for Windows)
- Colour Contrast Analyser
- Pa11y command line tool

### Online Tools
- WebAIM Contrast Checker
- WAVE Web Accessibility Evaluator
- axe-core GitHub pages

### Documentation
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Articles: https://webaim.org/articles/
- Deque University: https://dequeuniversity.com/