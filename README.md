# TypeZero

**TypeZero is a strict, local-first inference engine that generates type definitions and schemas from raw JSON payloads.**

It automates the translation of unstructured data (JSON) into structured contracts (TypeScript, Zod, SQL, Pydantic), running entirely in the browser memory without server-side processing.

---

## Architecture & Philosophy

### 1. Local-First
The core design constraint of TypeZero is privacy. Developers often paste sensitive production data (PII, financial records) into formatters. To mitigate data leakage risks, TypeZero operates on a **zero-knowledge architecture**:
* **No Persistence:** Payloads are processed in-memory. Nothing is written to a database or local storage.
* **Client-Side Runtime:** All inference logic executes within the V8 engine of the client browser. No API calls are made to external servers for parsing.
* **Ephemeral State:** The application state resets on session termination.

### 2. Deterministic Inference
Unlike LLM-based code generators which are probabilistic and prone to hallucination, TypeZero uses **deterministic recursive descent algorithms**.
* **Input:** Raw JSON (Object/Array).
* **Process:** The engine traverses the AST (Abstract Syntax Tree) of the JSON, mapping primitives to their strict language counterparts while flattening nested structures into distinct interfaces or table definitions.
* **Output:** Syntactically valid, compile-ready code.

---

## The Engines

The system is composed of four distinct transpiler modules, each handling specific language constraints.

### TypeScript Engine
* **Behavior:** Generates `interface` definitions.
* **Features:**
    * Detects optional fields (`?`) by analyzing array variances.
    * Recursively extracts nested objects into named interfaces to prevent `{ ... }` nesting hell.
    * Maps JSON `null` to `null | type`.

### Zod Engine
* **Behavior:** Generates runtime validation schemas.
* **Features:**
    * Chains validators (e.g., `z.string().email()` detection logic planned).
    * Automatically wraps fields in `.optional()` where data consistency is partial.

### SQL Engine (Postgres Dialect)
* **Behavior:** Generates DDL (`CREATE TABLE`) statements.
* **Logic:**
    * Infers column types (`TEXT`, `BOOLEAN`, `DOUBLE PRECISION`, `JSONB`).
    * Promotes nested objects and arrays to `JSONB` columns to preserve data integrity.
    * Auto-generates `BIGSERIAL` primary keys.

### Pydantic Engine (Python)
* **Behavior:** Generates Python class models inheriting from `BaseModel`.
* **Logic:**
    * Resolves type imports (`List`, `Optional`, `Any`).
    * Handles the "Bottom-Up" class definition order required by Python interpreters (child classes are defined before parents).
    * Maps TypeScript `Array<T>` to Python `List[T]`.

---

## Engineering Aspect

### 1. Custom Regex Tokenizer (Syntax Highlighting)
To avoid the bloat of heavy libraries like Prism.js or Monaco Editor, I implemented a lightweight, regex-based lexical analyzer (`lib/highlighter.ts`).
* **Challenge:** Regex collision. Naive implementations often match keywords inside string literals (e.g., matching the SQL keyword `KEY` inside a JSON value `"api_key"`).
* **Solution:** A single-pass combined regex pattern that prioritizes string literals before keywords. This ensures that tokenization is mutually exclusive and performant (O(n)).

### 2. Render Optimization
The main console uses a split-pane architecture (Input vs. Output). To ensure 60fps performance during rapid typing:
* **Debouncing:** The inference engines are decoupled from the UI thread using a 600ms debounce timer. This prevents the AST traversal from blocking the main thread on every keystroke.
* **Memoization:** `React.memo` and `useMemo` are aggressively used to isolate the sidebar history and header components from the editor's re-render cycles.
* **Scroll Synchronization:** The syntax highlighting layer (`<pre>`) and the input layer (`<textarea>`) are mathematically locked via `scrollTop` event listeners to create a seamless "IDE-like" experience.

### 3. Responsive Sidebar
The navigation implements a mobile-first collapsible drawer pattern using CSS transforms (`translate-x`) rather than layout shifts (`width`). This forces the GPU to handle the animation, preventing layout thrashing and repaint costs.

---

## Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript (Strict Mode)
* **Styling:** Tailwind CSS v4
* **Animation:** GSAP (GreenSock) for high-performance timeline sequencing.
* **Auth:** NextAuth.js (GitHub Provider) - Used strictly for access gating, not data tracking.

---

## Future Possible Updates

* **CLI Tool:** A Node.js binary (`npx typezero`) to pipe standard input directly to clipboard (e.g., `curl api | typezero --ts`).
* **VS Code Extension:** Inline generation context menu.
* **Heuristic Type refinement:** Detecting ISO dates strings and converting them to `Date` objects (TS) or `TIMESTAMP` (SQL).
* **Rust Migration:** Porting the core AST traversal logic to WASM (Rust) for processing multi-megabyte JSON payloads.
