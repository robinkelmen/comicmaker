# Comic Conventions & UX Research for Rapid Comic Creation Tool

> Research conducted December 2024 to inform data model design for a markdown-like comic DSL

## Executive Summary

This research synthesizes comic book conventions, lightweight markup languages, and child-friendly UX patterns to inform a data model for rapid comic creation. Three key insights emerged:

**1. Comics have a well-defined grammar.** Panel layouts, text elements (dialogue, narration, sound effects), and visual storytelling techniques follow established conventions that have evolved over 80+ years. The hierarchy is consistent: Comic → Pages → Panels → Elements (text, characters, effects). This maps cleanly to a nested data structure. The challenge isn't inventing structure—it's simplifying access to it.

**2. Fountain proves the "looks like what it is" principle works.** The screenplay markup language Fountain succeeded because scripts written in it look like screenplays even in plain text. Our comic DSL should follow this principle: a comic script should read like a comic script, with minimal markup overhead. Panel boundaries, dialogue, and sound effects should be visually obvious in the source text.

**3. Child-friendly doesn't mean dumbed-down—it means progressive disclosure.** The best creative tools for kids (Scratch, Book Creator) start simple but reveal power gradually. Large touch targets, immediate visual feedback, and forgiving interfaces matter. But the key insight is: kids can handle complexity if it's introduced incrementally. Our DSL should have a 5-minute learning curve for basics, with advanced features (custom layouts, style overrides) available but not required.

The proposed data model supports all three insights: a clean hierarchy that mirrors comic structure, fields that map directly to DSL syntax, and optional properties that enable progressive complexity without cluttering the simple case.

---

## Comic Conventions & Structure

### Panel Organization

#### Grid Systems

Grid layouts provide the foundation for comic page design. Common configurations:

| Grid Type | Use Case | Pacing Effect |
|-----------|----------|---------------|
| **2×2 (4 panels)** | Standard conversations, steady pacing | Balanced, predictable rhythm |
| **2×3 (6 panels)** | Detailed sequences, action breakdowns | Moderate pacing, room for detail |
| **3×3 (9 panels)** | Dense storytelling, tension building | Slow, deliberate—used famously in *Watchmen* |
| **Irregular** | Dynamic action, emotional moments | Varied pacing, visual interest |

The 9-panel grid (three tiers of three) became iconic through *Watchmen*, where Dave Gibbons maintained strict grid discipline even across double-page spreads. Grid layouts work in Western comics because horizontal text creates natural left-to-right, top-to-bottom reading flow.

#### Splash Pages & Special Layouts

- **Splash Page**: Full-page single panel, typically with credits. Used for dramatic entrances, reveals, or establishing shots.
- **Double-Page Spread**: Two facing pages as a single composition. Maximum visual impact.
- **Splash Panel**: Large panel (not full page) for emphasis within a page layout.
- **Broken Panels**: Character or action extends beyond panel border—conveys intense movement or breaking of boundaries.
- **Overlapping Panels**: Creates sense of rapid succession or chaos.

#### Reading Flow

**Western Comics (Left-to-Right)**:
- Follow "Z-path": left→right across rows, top→bottom down page
- Grid layouts work naturally with horizontal text
- Panel ambiguity resolved by dialogue balloon placement

**Manga (Right-to-Left)**:
- Follow "N-path": right→left, with more vertical movement
- Grid layouts are rare/avoided—panel edges rarely align
- More fluid, organic panel shapes
- Vertical text allows vertical panel arrangements

**Gutters** (space between panels):
- Control pacing—wider gutters = longer pause
- Standard width implies smooth transition
- Varying width within page creates rhythm
- Color/style can indicate flashbacks, dreams, etc.

### Text Elements

#### Speech Balloons (Dialogue)

| Type | Visual Style | Usage |
|------|--------------|-------|
| **Standard** | Oval/rounded rectangle with tail | Normal speech |
| **Burst/Jagged** | Irregular spiky edges | Shouting, anger, emphasis |
| **Whisper** | Dashed outline or small text | Quiet speech, secrets |
| **Thought Bubble** | Cloud shape with bubble tail | Internal thoughts (less common in modern comics) |
| **Wavy** | Wobbly outline | Weak, injured, or electronic voice |
| **Double Outline** | Two borders | Extra emphasis |
| **Character-Specific** | Custom colors/shapes | Deadpool's yellow, Venom's black jagged |
| **Robot/Electronic** | Angular/rectangular | Mechanical voices |

**Balloon Conventions**:
- Tail points to speaker's mouth (speech) or head (thought)
- Multiple speakers = multiple tails or connected balloons
- Reading order: top-to-bottom, left-to-right within panel
- Balloon placement guides eye through panel

#### Caption Boxes

| Type | Style | Content |
|------|-------|---------|
| **Location/Time** | Often colored or styled distinctly | "New York City, 1985" |
| **Internal Monologue** | Usually italicized | Character's inner voice |
| **Narration** | Standard text | Third-person storytelling |
| **Spoken (Off-Panel)** | Quotation marks | Dialogue from unseen character |
| **Editorial** | Often yellow/different color | Meta-commentary, "See issue #42!" |

#### Lettering Conventions

- **ALL CAPS**: Standard for dialogue (easier to read at small sizes)
- **Serif "I"**: Personal pronoun uses serif I, other instances sans-serif
- **Bold**: Emphasis within dialogue
- **Double Dash (--)**: Interruption (no em dash in American comics)
- **Breath Marks**: Three vertical dashes for coughs, sputters
- **"Zzz"**: Sleep indicator (dating to early 1900s)

### Sound Effects (Onomatopoeia)

Sound effects are visual representations of audio, integrated into the artwork.

#### Design Principles

1. **Size = Volume**: Larger text = louder sound
2. **Letter Repetition = Duration**: "CRAAAASH" longer than "CRASH"
3. **Font Weight = Impact**: Heavy fonts for impacts, thin for high-pitched sounds
4. **Style Matches Genre**: Gritty fonts for noir, clean for superhero, brush strokes for manga

#### Common Categories

| Category | Examples | Visual Treatment |
|----------|----------|------------------|
| **Impacts** | WHAM, POW, THUD, CRACK | Bold, angular, often with motion lines |
| **Explosions** | BOOM, KABOOM, BLAM | Large, radiating, warm colors |
| **Movement** | WHOOSH, ZOOM, SWOOSH | Elongated, curved, motion blur |
| **Small Sounds** | click, tap, drip | Smaller, lighter weight |
| **Character Sounds** | SNIKT (Wolverine's claws), THWIP (Spider-Man) | Iconic, consistent across appearances |

#### Cultural Variations

- **Manga**: Highly stylized, often untranslated, integrated into artwork as design elements
- **European Comics**: More subtle integration, sometimes narrative ("Two shots ring out...")
- **American Superhero**: Bold, explosive, part of the action

### Visual Storytelling Patterns

#### Scott McCloud's Six Transitions

From *Understanding Comics*, the foundational theory of comic storytelling:

1. **Moment-to-Moment**: Micro-changes, slow motion effect (rare)
2. **Action-to-Action**: Single subject progressing through action (most common)
3. **Subject-to-Subject**: Different subjects, same scene
4. **Scene-to-Scene**: Jumps in time/space
5. **Aspect-to-Aspect**: Different views of same moment/mood (common in manga)
6. **Non-Sequitur**: Unrelated images (experimental)

**Usage by Genre**:
- Action/Plot stories: Heavy on action-to-action
- Romance: More subject-to-subject
- Literary/Art comics: More aspect-to-aspect

#### Panel Size & Pacing

| Panel Size | Effect |
|------------|--------|
| Small/many panels | Fast pacing, rapid action |
| Large panels | Slow pacing, dramatic emphasis |
| Varying sizes | Dynamic rhythm, visual interest |
| Full page | Maximum pause, major moment |

#### "Closure" - Reader Participation

The gutter is where the reader's imagination completes the action. McCloud's "blood in the gutter" example: Panel 1 shows raised knife, Panel 2 shows "AAAAA!"—the violence happens in the reader's mind.

### Style Variations

#### Western Comics (American/European)

- Panel grids more structured
- Clear panel borders
- Detailed backgrounds
- Full-color standard
- Sound effects as separate design elements
- Thought bubbles historically common

#### Manga

- Right-to-left reading
- More varied panel shapes
- Frequent borderless panels
- Screentone for shading
- Sound effects integrated into art
- Speed lines and motion effects prominent
- More aspect-to-aspect transitions
- Exaggerated expressions ("super-deformed" for comedy)

#### Webcomics/Webtoons

- Vertical scroll format (webtoons)
- Infinite canvas possibilities
- Larger gutters for pacing in scroll format
- Optimized for screen reading
- Often simpler art styles for update frequency

---

## Simplified DSL Patterns

### Fountain: The Gold Standard for Domain-Specific Markup

Fountain is a plain-text screenplay format that proves lightweight markup can handle professional creative work.

#### Why Fountain Works

1. **"Looks like what it is"**: A Fountain script looks like a screenplay even without rendering
2. **Minimal markup**: Most elements detected automatically by position/formatting
3. **Force characters**: When auto-detection fails, simple prefix overrides (@ for character, ! for action)
4. **Readable raw**: You can read/write without special software
5. **Tool-agnostic**: Works in any text editor

#### Fountain Syntax Summary

```fountain
INT. COFFEE SHOP - DAY

SARAH sits alone, staring at her phone.

MIKE (O.S.)
Mind if I join you?

SARAH
(looking up, surprised)
Mike? I thought you left town.

MIKE
Plans change.

> FADE TO:
```

**Key Patterns**:
- Scene headings: Start with INT/EXT (auto-detected)
- Character names: ALL CAPS on own line (auto-detected)
- Dialogue: Follows character name
- Parentheticals: Wrapped in (parentheses)
- Transitions: End in TO: or forced with >
- Action: Everything else

#### Lessons for Comic DSL

1. **Auto-detect where possible**: Panel breaks, dialogue, sound effects should be obvious from formatting
2. **Force characters for edge cases**: When auto-detection fails, provide escape hatches
3. **Position matters**: What appears after what determines meaning
4. **Whitespace is semantic**: Blank lines separate elements
5. **Don't require markup for common cases**: Only force markup for exceptions

### Markdown Patterns

Markdown's success comes from:

- **Headers**: `#` characters (scalable: more = smaller)
- **Emphasis**: `*italic*` and `**bold**` (visually suggestive)
- **Lists**: Start with `-` or `1.` (natural)
- **Links**: `[text](url)` (readable inline)
- **Code**: Backticks (` ` `) for inline, fences (```) for blocks

**What to steal**:
- Use `#` for page numbers
- Use indentation for hierarchy
- Use simple delimiters for special elements
- Make the plain text version readable

### Proposed Comic DSL Principles

1. **Page = Section**: Clear visual break for new pages
2. **Panel = Paragraph**: Blank line separates panels
3. **Dialogue = Attribution + Content**: Like screenplay format
4. **Sound Effects = Distinct Syntax**: Easily identifiable
5. **Directions = Comments**: For artist instructions
6. **Metadata = Frontmatter**: YAML-like header for comic-level settings

---

## UX Patterns for Creative Tools

### Child-Friendly Design Principles

From research on successful kids' apps (Scratch, Toca Boca, Book Creator):

#### Visual Design

- **Large touch targets**: Minimum 44x44px, preferably larger for young children
- **High contrast**: Clear distinction between interactive and static elements
- **Limited color palette**: Consistent, not overwhelming
- **Big, readable fonts**: Simple sans-serif, generous sizing
- **Visual hierarchy**: Important things look important

#### Interaction Design

- **Immediate feedback**: Every action produces visible result
- **Forgiving**: Undo always available, hard to make unrecoverable mistakes
- **No dead ends**: Always a clear next action
- **Discovery through play**: Learn by doing, not reading instructions
- **Familiar patterns**: Use conventions kids know from other apps

#### Scaffolding & Templates

- **Start with something**: Never blank canvas—provide templates
- **Modify before create**: Easier to edit than start from scratch
- **Progressive complexity**: Simple tools first, advanced tools revealed gradually
- **Guided creation**: Wizard-style flows for beginners
- **Examples everywhere**: Show what's possible

#### Age-Specific Considerations

| Age | Considerations |
|-----|----------------|
| **4-6** | No reading required, large tap targets, simple cause-effect |
| **7-9** | Basic reading, can follow simple instructions, enjoy customization |
| **10-12** | Full reading, can handle complexity, want creative control |
| **13+** | Near-adult capabilities, appreciate efficiency, may prefer text interfaces |

### Progressive Disclosure Implementation

#### Levels of Complexity

**Level 1 - Basic** (5-minute learning curve):
- Choose template
- Add dialogue
- Preview/export

**Level 2 - Intermediate** (revealed after using basics):
- Custom panel layouts
- Sound effects
- Character emotions
- Multiple pages

**Level 3 - Advanced** (explicitly accessed):
- Custom styles
- Panel shape editing
- Export options
- AI generation parameters

#### UI Patterns for Progressive Disclosure

1. **Toggles**: "Show advanced options" expands additional controls
2. **Contextual reveals**: Advanced options appear when relevant
3. **Separate modes**: "Simple" vs "Pro" mode switch
4. **Hover/long-press**: Additional options on extended interaction
5. **Settings panel**: Power features tucked away but findable

### Visual Feedback Mechanisms

For a comic creation tool, users need to see:

1. **Live preview**: Real-time rendering of comic as they type
2. **Panel highlighting**: Which panel they're currently editing
3. **Element indicators**: Visual markers for dialogue, effects, etc.
4. **Validation feedback**: Warnings for issues (missing dialogue, etc.)
5. **Progress indication**: Page count, panel count, completion state

### Real-Time Preview Architecture

```
┌─────────────────────────────────────────────────────┐
│  Editor (Left)           │  Preview (Right)         │
├─────────────────────────────────────────────────────┤
│                          │                          │
│  # Page 1                │  ┌──────┬──────┐        │
│                          │  │      │      │        │
│  Panel with Sarah        │  │  P1  │  P2  │        │
│  at the coffee shop      │  │      │      │        │
│                          │  ├──────┴──────┤        │
│  SARAH                   │  │             │        │
│  Hello, world!           │  │     P3      │        │
│                          │  │             │        │
│  ---                     │  └─────────────┘        │
│                          │                          │
│  Panel with Mike         │  [Page 1 of 1]          │
│  entering                │                          │
│                          │                          │
└─────────────────────────────────────────────────────┘
```

---

## Proposed Data Model

### TypeScript Definitions

```typescript
// =============================================================================
// CORE TYPES
// =============================================================================

/**
 * A complete comic project. Top-level container.
 *
 * Why this structure:
 * - `id` enables database storage and API references
 * - `title/author` are display metadata
 * - `style` provides AI generation defaults (can be overridden per-panel)
 * - `pages` is the actual content hierarchy
 * - `createdAt/updatedAt` support sync and versioning
 */
export interface Comic {
  id: string;
  title: string;
  author?: string;
  description?: string;

  // Global style settings (defaults for AI generation)
  style: ComicStyle;

  // The actual content
  pages: Page[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // Optional: character definitions for consistency
  characters?: CharacterDefinition[];
}

/**
 * Style configuration for AI image generation.
 * Can be set at comic level (default) or overridden per-panel.
 *
 * Why these fields:
 * - `preset` provides quick selection for kids ("manga", "superhero")
 * - `artStyle` maps to AI model style prompts
 * - `colorPalette` influences generation colors
 * - `mood` affects lighting, expressions, atmosphere
 * - `customPrompt` is the escape hatch for advanced users
 */
export interface ComicStyle {
  preset?: StylePreset;
  artStyle?: string;        // "cel-shaded", "watercolor", "line art", etc.
  colorPalette?: string;    // "vibrant", "muted", "noir", "pastel"
  mood?: string;            // "cheerful", "dramatic", "mysterious"
  customPrompt?: string;    // Advanced: additional prompt text for AI
}

export type StylePreset =
  | 'manga'
  | 'superhero'
  | 'cartoon'
  | 'realistic'
  | 'chibi'
  | 'noir'
  | 'webcomic'
  | 'custom';

/**
 * Character definition for consistent AI generation.
 * Optional but useful for multi-page comics.
 */
export interface CharacterDefinition {
  id: string;
  name: string;
  description: string;      // Physical description for AI
  visualTraits?: string[];  // ["red hair", "glasses", "blue jacket"]
  referenceImageUrl?: string;
}

// =============================================================================
// PAGE STRUCTURE
// =============================================================================

/**
 * A single page in the comic.
 *
 * Why this structure:
 * - `pageNumber` for ordering and display
 * - `layout` defines panel arrangement (flexible grid system)
 * - `panels` contains the actual content
 * - `backgroundColor` for page-level styling (default: white)
 */
export interface Page {
  id: string;
  pageNumber: number;

  // Layout definition (defaults to auto-layout if not specified)
  layout?: PageLayout;

  // Panels on this page
  panels: Panel[];

  // Page-level styling
  backgroundColor?: string;
}

/**
 * Flexible layout system.
 *
 * Three modes:
 * 1. `preset`: Quick selection ("2x2", "3x3", "splash")
 * 2. `rows`: Row-based definition (most intuitive for DSL)
 * 3. `grid`: Full custom grid (advanced)
 *
 * The DSL will primarily use `rows` for simplicity.
 */
export interface PageLayout {
  // Quick preset selection
  preset?: LayoutPreset;

  // Row-based layout: each row has n panels
  // Example: [2, 1] means "2 panels in first row, 1 full-width in second"
  rows?: number[];

  // Advanced: full grid specification
  grid?: GridLayout;
}

export type LayoutPreset =
  | 'single'    // Full page, one panel
  | '2x1'       // Two panels stacked vertically
  | '1x2'       // Two panels side by side
  | '2x2'       // Four equal panels
  | '3x3'       // Nine equal panels (Watchmen style)
  | '2x3'       // Six panels
  | 'splash';   // Splash page (alias for 'single')

/**
 * Advanced grid layout for custom arrangements.
 * Each cell specifies position and span.
 */
export interface GridLayout {
  columns: number;          // Number of columns in grid
  rows: number;             // Number of rows in grid
  cells: GridCell[];        // Panel placement definitions
}

export interface GridCell {
  panelId: string;          // Reference to panel
  column: number;           // Starting column (0-indexed)
  row: number;              // Starting row (0-indexed)
  columnSpan?: number;      // How many columns to span (default: 1)
  rowSpan?: number;         // How many rows to span (default: 1)
}

// =============================================================================
// PANEL STRUCTURE
// =============================================================================

/**
 * A single panel - the core unit of comic storytelling.
 *
 * Why this structure:
 * - `description` is the scene description (becomes AI prompt)
 * - `elements` are the dialogue, sound effects, captions
 * - `style` overrides comic-level style for this panel
 * - `characters` lists who appears (for AI consistency)
 * - `generatedImage` stores the AI output
 * - `shape` allows non-rectangular panels
 */
export interface Panel {
  id: string;

  // Scene description (primary input for AI image generation)
  description: string;

  // Elements layered on the panel
  elements: PanelElement[];

  // Optional: override comic-level style
  style?: Partial<ComicStyle>;

  // Characters in this panel (references character definitions)
  characters?: string[];    // Character IDs

  // AI generation result
  generatedImage?: GeneratedImage;

  // Visual customization
  shape?: PanelShape;
  border?: PanelBorder;

  // Metadata
  transitionNote?: string;  // Note about transition to next panel
}

/**
 * Generated image data from AI.
 */
export interface GeneratedImage {
  url: string;              // Image URL or data URL
  prompt: string;           // The actual prompt sent to AI
  model: string;            // Which AI model generated this
  generatedAt: Date;

  // For regeneration
  seed?: number;
  parameters?: Record<string, unknown>;
}

/**
 * Panel shape definition.
 * Supports rectangles (default), rounded rectangles, and custom paths.
 */
export interface PanelShape {
  type: 'rectangle' | 'rounded' | 'circle' | 'custom';
  borderRadius?: number;    // For 'rounded' type
  path?: string;            // SVG path for 'custom' type
}

export interface PanelBorder {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'none' | 'jagged';
}

// =============================================================================
// PANEL ELEMENTS
// =============================================================================

/**
 * Union type for all elements that can appear in a panel.
 * Each element has position, content, and type-specific styling.
 */
export type PanelElement =
  | DialogueElement
  | NarrationElement
  | SoundEffectElement
  | ThoughtElement;

/**
 * Base properties shared by all panel elements.
 */
interface BaseElement {
  id: string;

  // Position within panel (0-1 normalized, optional for auto-layout)
  position?: {
    x: number;              // 0 = left, 1 = right
    y: number;              // 0 = top, 1 = bottom
  };

  // Layer order (higher = on top)
  zIndex?: number;
}

/**
 * Dialogue - speech from a character.
 *
 * Why these fields:
 * - `character` identifies the speaker
 * - `text` is the actual dialogue
 * - `emotion` affects balloon style and AI generation
 * - `volume` affects balloon style (whisper/normal/shout)
 * - `balloonStyle` allows full customization
 */
export interface DialogueElement extends BaseElement {
  type: 'dialogue';
  character: string;        // Character name or ID
  text: string;

  // Emotional/volume modifiers
  emotion?: Emotion;
  volume?: 'whisper' | 'normal' | 'shout';

  // Visual customization
  balloonStyle?: BalloonStyle;
  tailDirection?: 'auto' | 'left' | 'right' | 'up' | 'down';
}

/**
 * Narration - caption boxes for scene-setting or voiceover.
 */
export interface NarrationElement extends BaseElement {
  type: 'narration';
  text: string;

  // Narration type affects styling
  narratorType?: 'omniscient' | 'character' | 'location' | 'time';
  character?: string;       // If character narration, which character

  // Visual customization
  boxStyle?: BoxStyle;
}

/**
 * Sound effect - onomatopoeia integrated into artwork.
 */
export interface SoundEffectElement extends BaseElement {
  type: 'soundEffect';
  text: string;             // The sound: "WHAM!", "creak", "BOOM"

  // Intensity affects size and style
  intensity?: 'subtle' | 'medium' | 'loud' | 'explosive';

  // Visual customization
  fontStyle?: string;       // Font name or style keyword
  color?: string;
  rotation?: number;        // Degrees
  effect?: 'none' | 'outline' | 'shadow' | 'glow' | '3d';
}

/**
 * Thought bubble - internal thoughts.
 */
export interface ThoughtElement extends BaseElement {
  type: 'thought';
  character: string;
  text: string;

  // Visual customization
  bubbleStyle?: 'cloud' | 'fade' | 'modern';
}

// =============================================================================
// STYLING TYPES
// =============================================================================

export type Emotion =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'scared'
  | 'confused'
  | 'excited';

export interface BalloonStyle {
  shape: 'oval' | 'rounded' | 'burst' | 'wavy' | 'square' | 'custom';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  font?: string;
  fontSize?: number;
  textColor?: string;
}

export interface BoxStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  font?: string;
  fontSize?: number;
  textColor?: string;
}

// =============================================================================
// API TYPES (for AI generation integration)
// =============================================================================

/**
 * Request to generate panel image.
 */
export interface GeneratePanelRequest {
  panelId: string;
  description: string;
  style: ComicStyle;
  characters?: CharacterDefinition[];

  // AI provider configuration
  provider: 'replicate' | 'stability' | 'openai' | 'local';
  model?: string;

  // Generation parameters
  width?: number;
  height?: number;
  seed?: number;
}

/**
 * Response from AI generation.
 */
export interface GeneratePanelResponse {
  success: boolean;
  image?: GeneratedImage;
  error?: string;
}

// =============================================================================
// DSL PARSING TYPES
// =============================================================================

/**
 * Result of parsing comic DSL text.
 */
export interface ParseResult {
  success: boolean;
  comic?: Comic;
  errors?: ParseError[];
  warnings?: ParseWarning[];
}

export interface ParseError {
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

export interface ParseWarning {
  line: number;
  message: string;
}
```

### Data Model Rationale

#### Supports Simple DSL Creation

The model mirrors natural comic script structure:
- **Comic** = the whole project (frontmatter in DSL)
- **Page** = major section (# Page 1)
- **Panel** = paragraph-level unit (separated by blank lines)
- **Element** = inline content (dialogue, effects)

Each DSL construct maps 1:1 to a data structure, making parsing straightforward.

#### Enables Flexible Panel Layouts

Three levels of layout complexity:
1. **Auto**: No layout specified → panels flow naturally
2. **Preset**: `layout: 2x2` → quick common layouts
3. **Custom**: Full grid specification → any arrangement

Most users will never need level 3.

#### Optimized for AI Image Generation

The `Panel.description` field is the primary AI prompt input. Combined with:
- `ComicStyle` (global defaults)
- `CharacterDefinition` (consistency)
- `emotion` modifiers (affect both balloon style AND generated image)

This produces rich prompts without user complexity.

#### Child-Friendly Through Progressive Disclosure

**Required fields are minimal**:
```typescript
// Minimum valid panel
const panel: Panel = {
  id: "1",
  description: "A dog sitting in a park",
  elements: []
};
```

**Power features are optional**:
- Custom layouts
- Style overrides
- Position fine-tuning
- Character definitions

Kids can create comics with just descriptions and dialogue.

#### Supports Rapid Creation

- No required IDs in DSL (auto-generated)
- Sensible defaults for all optional fields
- Batch operations (generate all panels)
- Simple export (data serializes cleanly to JSON)

---

## DSL Specification & Examples

### Syntax Overview

```
---
title: My Comic
author: Artist Name
style: manga
---

# Page 1

[2x2]                           // Optional layout hint

A sunny park with a bench       // Panel 1 description

SARAH                           // Character name (caps)
Hello, world!                   // Dialogue

---                             // Panel separator

Mike walking into the park      // Panel 2 description

MIKE (excited)                  // Character + emotion
Sarah! Over here!

*RUSTLE*                        // Sound effect (asterisks)

---

Close-up of Sarah smiling       // Panel 3

SARAH (happy)
It's so good to see you!

// This is a comment            // Comments with //
```

### Element Syntax

| Element | Syntax | Example |
|---------|--------|---------|
| Page break | `# Page N` | `# Page 2` |
| Panel separator | `---` | `---` |
| Layout hint | `[preset]` | `[2x2]`, `[splash]` |
| Dialogue | `CHARACTER` + newline + text | `SARAH`<br>`Hi there!` |
| Emotion modifier | `(emotion)` after name | `MIKE (angry)` |
| Shout | `!` at end of text | `Watch out!` |
| Whisper | `*text*` | `*psst, over here*` |
| Sound effect | `*ALLCAPS*` | `*BOOM*` |
| Narration | `> text` | `> Meanwhile, in the city...` |
| Thought | `~ text` | `~ I wonder what he wants...` |
| Comment | `// text` | `// maybe add more action here` |

### Example 1: Simple Conversation

```markdown
---
title: Coffee Shop Chat
style: webcomic
---

# Page 1

Interior of a cozy coffee shop, warm lighting

SARAH
Mind if I sit here?

---

A friendly-looking guy looks up from his laptop

MIKE
Sure! I'm Mike.

SARAH (happy)
I'm Sarah. Nice to meet you!

---

Wide shot of both at the table, steam rising from cups

MIKE
So what brings you here?

SARAH
Just needed a change of scenery. You?

MIKE
Same. Plus the wifi is great.
```

**Renders as**: 3 panels, auto-arranged, simple conversation flow.

### Example 2: Action Scene with Sound Effects

```markdown
---
title: Hero's Entrance
style: superhero
---

# Page 1

[splash]

A caped hero bursting through a warehouse wall, debris flying

*KRASH!*

> The moment everything changed.

---

# Page 2

[rows: 2, 1]

Close-up of villain's shocked face

VILLAIN (surprised)
Impossible!

---

Hero landing in a crouch, cape settling

HERO
Nothing's impossible.

---

Wide shot: hero standing, villain backed against wall

VILLAIN (angry)
You'll regret this!

HERO
I doubt it.

*WHOOOOSH*
```

**Renders as**: 1 splash page, then 3 panels (2 on top row, 1 full-width below).

### Example 3: Manga Style with Emotions

```markdown
---
title: School Days
style: manga
characters:
  - name: Yuki
    traits: [short black hair, school uniform, glasses]
  - name: Hana
    traits: [long brown hair, cheerful expression, ribbon]
---

# Page 1

School rooftop, cherry blossoms falling

YUKI
~ Another boring day...

---

Hana bursting through the rooftop door

*BANG*

HANA (excited)
Yuki! Yuki! Guess what!

---

Close-up of Yuki adjusting glasses, surprised

YUKI (confused)
Hana? What's wrong?

---

Hana holding up two concert tickets, sparkling effect

HANA (happy)
I got tickets! We're going to see Stellar Echo!

---

# Page 2

[rows: 1, 2]

Both girls jumping with joy, sparkles everywhere

YUKI (excited)
No way!

HANA
Way!

*KYAAA!*

---

Other students looking up at the noise

STUDENT 1
What's going on up there?

---

Teacher sighing at desk

> Some things never change.
```

---

## Implementation Recommendations

### MVP Feature Set

**Must Have (Week 1-2)**:
- DSL parser (text → data model)
- Basic preview renderer (data model → visual)
- Single AI provider integration (Replicate recommended)
- Export to PNG/PDF

**Should Have (Week 3-4)**:
- Live preview (side-by-side editor)
- Multiple layout presets
- Basic balloon/effect styling
- Page navigation

**Nice to Have (Later)**:
- Visual panel adjustment (drag to resize)
- Multiple AI providers
- Character consistency features
- Publishing integrations

### Panel Geometry System

For visual adjustment of panel shapes:

```typescript
interface PanelGeometry {
  // Normalized coordinates (0-1)
  bounds: {
    x: number;      // Left edge
    y: number;      // Top edge
    width: number;  // Panel width
    height: number; // Panel height
  };

  // For irregular shapes
  clipPath?: string;  // CSS clip-path or SVG path
}
```

**Interaction patterns**:
1. **Preset selection**: Click layout preset buttons
2. **Drag dividers**: Grab gutter to resize adjacent panels
3. **Direct input**: Type specific values in panel inspector
4. **Keyboard shortcuts**: Arrow keys to nudge selected panel

### Quick Adjustment Patterns

| Action | Mouse | Keyboard |
|--------|-------|----------|
| Select panel | Click | Tab through |
| Resize panel | Drag edge | Shift + arrows |
| Move panel | Drag center | Arrows |
| Add panel | Double-click gutter | Enter in empty area |
| Delete panel | Right-click → delete | Backspace |
| Undo | — | Ctrl/Cmd + Z |

### AI Generation Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User writes DSL                                          │
│    └─> Parser creates Comic data structure                  │
│                                                              │
│ 2. User clicks "Generate"                                   │
│    └─> For each panel:                                      │
│        └─> Build prompt from description + style + chars    │
│        └─> Call AI API                                      │
│        └─> Store result in panel.generatedImage             │
│                                                              │
│ 3. User can regenerate individual panels                    │
│    └─> Same flow, single panel                              │
│                                                              │
│ 4. Export combines generated images + text elements         │
│    └─> Render to canvas → PNG/PDF                           │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Tech Stack

| Layer | Recommendation | Rationale |
|-------|----------------|-----------|
| Frontend | React + TypeScript | Component model fits comic structure |
| Editor | CodeMirror 6 | Excellent for custom syntax highlighting |
| Canvas | Fabric.js or Konva | Good for draggable panel manipulation |
| State | Zustand | Simple, minimal boilerplate |
| AI API | Replicate | Cheapest, good model selection, easy API |
| Export | html2canvas + jspdf | Browser-based, no server needed |

### Error Handling for Kids

```typescript
interface FriendlyError {
  // Technical details (for debugging)
  code: string;
  message: string;
  line?: number;

  // Kid-friendly explanation
  friendlyMessage: string;
  suggestion: string;

  // Visual hint
  highlightRange?: { start: number; end: number };
}

// Example
const error: FriendlyError = {
  code: 'MISSING_PANEL_DESCRIPTION',
  message: 'Panel at line 12 has no description',
  line: 12,
  friendlyMessage: "This panel doesn't know what to show!",
  suggestion: "Add a description like 'A sunny beach' before the dialogue",
  highlightRange: { start: 145, end: 148 }
};
```

---

## Testing & Validation Workflow

### DSL Validation Pipeline

```typescript
// validators/comic-validator.ts

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export function validateComic(comic: Comic): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!comic.title) {
    errors.push({ field: 'title', message: 'Comic needs a title' });
  }

  if (comic.pages.length === 0) {
    errors.push({ field: 'pages', message: 'Comic needs at least one page' });
  }

  // Page validation
  comic.pages.forEach((page, i) => {
    if (page.panels.length === 0) {
      warnings.push({
        field: `pages[${i}]`,
        message: `Page ${i + 1} has no panels`
      });
    }

    // Panel validation
    page.panels.forEach((panel, j) => {
      if (!panel.description || panel.description.trim() === '') {
        errors.push({
          field: `pages[${i}].panels[${j}]`,
          message: `Panel ${j + 1} on page ${i + 1} needs a description`
        });
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

### Test Script

```bash
#!/bin/bash
# scripts/test-dsl.sh

echo "=== Comic DSL Test Suite ==="

# Test 1: Valid minimal comic
echo "Test 1: Minimal valid comic..."
cat > /tmp/test-comic.md << 'EOF'
---
title: Test Comic
---

# Page 1

A simple scene

HERO
Hello!
EOF

npm run parse /tmp/test-comic.md && echo "✓ PASS" || echo "✗ FAIL"

# Test 2: Missing title
echo "Test 2: Missing title (should warn)..."
cat > /tmp/test-comic-2.md << 'EOF'
# Page 1

A scene without title

HERO
Hi!
EOF

npm run validate /tmp/test-comic-2.md 2>&1 | grep -q "warning" && echo "✓ PASS" || echo "✗ FAIL"

# Test 3: Complex comic
echo "Test 3: Complex multi-page comic..."
cat > /tmp/test-comic-3.md << 'EOF'
---
title: Complex Test
style: manga
---

# Page 1

[2x2]

Panel one description

HERO (excited)
First panel!

---

Panel two

VILLAIN
*evil laugh*

*CRASH*

---

Panel three

> Narration box here

---

Panel four

~ Internal thought

---

# Page 2

[splash]

Epic splash page scene

HERO
The end!
EOF

npm run parse /tmp/test-comic-3.md && npm run validate /tmp/test-comic-3.md && echo "✓ PASS" || echo "✗ FAIL"

echo "=== Tests Complete ==="
```

### Integration Test with AI

```typescript
// tests/ai-integration.test.ts

import { generatePanel } from '../src/services/ai';
import { Panel, ComicStyle } from '../src/types';

describe('AI Integration', () => {
  // Skip in CI, run manually
  it.skip('generates image from panel description', async () => {
    const panel: Panel = {
      id: 'test-1',
      description: 'A cartoon cat sitting on a windowsill, looking outside',
      elements: []
    };

    const style: ComicStyle = {
      preset: 'cartoon',
      artStyle: 'cel-shaded'
    };

    const result = await generatePanel({
      panelId: panel.id,
      description: panel.description,
      style,
      provider: 'replicate',
      model: 'stability-ai/sdxl'
    });

    expect(result.success).toBe(true);
    expect(result.image?.url).toBeDefined();
  }, 60000); // 60s timeout for AI generation
});
```

---

## AI Provider Options

### Recommended: Replicate

**Pros**:
- Pay-per-use ($0.0025-0.012 per image)
- Wide model selection (SDXL, Flux, custom)
- Simple REST API
- No minimum commitment
- Can self-host models

**Setup**:
```bash
# Get API token from replicate.com
export REPLICATE_API_TOKEN=r8_xxxxx
```

```typescript
// services/replicate.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImage(prompt: string): Promise<string> {
  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
      }
    }
  );

  return output[0]; // Image URL
}
```

### Alternative: Stability AI

**Pros**:
- Direct access to Stable Diffusion
- Credit-based pricing
- Self-hosted option available

**Setup**:
```typescript
// services/stability.ts
const API_HOST = 'https://api.stability.ai';

export async function generateImage(prompt: string): Promise<Buffer> {
  const response = await fetch(
    `${API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
      }),
    }
  );

  const data = await response.json();
  return Buffer.from(data.artifacts[0].base64, 'base64');
}
```

### Self-Hosted Option

For users who want to run locally or avoid API costs:

**Requirements**:
- GPU with 8GB+ VRAM (RTX 3060 or better)
- ~10GB disk space for models
- Docker (simplest setup)

**Setup with Docker**:
```bash
# Pull and run Stable Diffusion WebUI
docker run -d \
  --gpus all \
  -p 7860:7860 \
  -v sd-models:/models \
  ghcr.io/automatic1111/stable-diffusion-webui:latest

# API endpoint will be at http://localhost:7860/api/v1
```

**ComicMaker Configuration**:
```env
# .env.local
AI_PROVIDER=local
AI_ENDPOINT=http://localhost:7860/api/v1
```

### Provider Comparison

| Provider | Cost | Quality | Speed | Self-Host |
|----------|------|---------|-------|-----------|
| Replicate | $0.003-0.012/img | High | 5-15s | Via Cog |
| Stability | $0.002-0.006/credit | High | 3-10s | License required |
| OpenAI (DALL-E) | $0.04-0.08/img | High | 10-20s | No |
| Local SD | GPU + electricity | Medium-High | 10-60s | Yes |

---

## Future Considerations

### Potential Enhancements

1. **Character Consistency**
   - Upload reference images
   - Use IP-Adapter or similar for consistent characters
   - Store character embeddings

2. **Animation/Motion**
   - Export to video (panel transitions)
   - Simple animation within panels
   - Parallax effects for webtoon scroll

3. **Collaboration**
   - Real-time multiplayer editing
   - Comments and annotations
   - Version history

4. **Publishing Integrations**
   - Direct upload to Webtoon/Tapas
   - Social media formatting
   - Print-ready export (CMYK, bleed)

5. **Advanced Layout**
   - Irregular panel shapes (drawn paths)
   - Broken panels (elements crossing borders)
   - Full bleed pages

6. **Accessibility**
   - Alt text generation for images
   - Screen reader support
   - High contrast mode

### Platform Considerations

| Platform | Considerations |
|----------|----------------|
| **Web** | Primary target, works everywhere |
| **Mobile** | Touch-friendly editor needed |
| **Desktop** | Electron wrapper possible |
| **Tablet** | Best creative device, prioritize |

### Monetization Options (if applicable)

- Freemium: Basic features free, advanced paid
- AI credits: Buy generation credits
- Templates: Sell premium templates
- Publishing: Commission on sales

---

## Sources

### Comic Conventions & Theory
- [Beyond the Cape: Comic Panel Layouts](https://comicbookco.com/comics/comic-panel-layouts-grids-gutters-splash-pages-flow/) - Panel layouts, grids, splash pages
- [The Grids – Making Comics](https://salgoodsam.com/mc/the-nine-panel-grid/) - Nine-panel grid analysis
- [Pro Artist's Guide to Comic & Manga Layouts](https://www.clipstudio.net/how-to-draw/archives/160963) - Professional layout techniques
- [Analyzing Comics 101: Layout](https://thepatronsaintofsuperheroes.wordpress.com/2015/12/07/analyzing-comics-101-layout/) - Layout theory
- [Comic Book Grammar & Tradition – Blambot](https://blambot.com/pages/comic-book-grammar-tradition) - Lettering conventions
- [Understanding Comics - Transitions](https://understandingcomics177.wordpress.com/about/1-2/2-2/) - McCloud's panel transitions
- [Comic Sound Effects Evolution](https://comicbookco.com/comics/comic-book-sound-effects-evolution/) - Sound effect conventions
- [Visual Languages of Manga and Comics](https://www.hoodedutilitarian.com/2010/06/visual-languages-of-manga-and-comics/) - Manga vs Western comparison

### DSL & Markup Languages
- [Fountain Syntax](https://fountain.io/syntax/) - Screenplay markup reference
- [JotterPad: What is Fountain](https://jotterpad.app/what-is-fountain-screenplay/) - Fountain overview
- [Markdown Guide](https://www.markdownguide.org/getting-started/) - Markdown syntax
- [Comic Script Basics – Blambot](https://blambot.com/pages/comic-script-basics) - Professional comic scripts
- [How To Format a Comic Book Script](https://www.frankgogol.com/making-comics/how-to-format-a-comic-script-explained/) - Script formatting

### UX Design for Children
- [UX Design for Children – Eleken](https://www.eleken.co/blog-posts/ux-design-for-children-how-to-create-a-product-children-will-love) - Child-friendly design principles
- [UI/UX Design Tips for Child-Friendly Interfaces](https://www.aufaitux.com/blog/ui-ux-designing-for-children/) - Interface design for kids
- [UX Design for Kids – Ramotion](https://www.ramotion.com/blog/ux-design-for-kids/) - Design recommendations
- [Product Design For Kids – UX Studio](https://www.uxstudioteam.com/ux-blog/design-for-kids) - Child psychology in UX
- [Progressive Disclosure – NN/g](https://www.nngroup.com/articles/progressive-disclosure/) - Nielsen Norman Group on progressive disclosure

### AI Image Generation
- [Replicate Pricing](https://replicate.com/pricing) - AI generation costs
- [Stability AI Pricing](https://platform.stability.ai/pricing) - Stability API pricing
- [Best AI Image Generator Comparison 2024](https://team-gpt.com/blog/best-ai-image-generator) - Provider comparison
- [Stable Diffusion on Replicate](https://replicate.com/stability-ai/stable-diffusion) - Model documentation

### Comic Creation Software
- [Clip Studio Paint Features](https://www.clipstudio.net/en/functions/comic/) - Professional comic tools
- [Tools for Getting Started in Webcomics](https://kcomicsbeat.com/2024/12/13/tools-for-getting-started-in-webcomics/) - Modern webcomic tools
