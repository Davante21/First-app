# Neumorphic Calculator: Flutter Gems assignment

This is a **student customization of another developer's Flutter app**, prepared in a separate branch of an existing student-owned repository.

- Original author: [belelaritra](https://github.com/belelaritra)
- Original source: https://github.com/belelaritra/Neumorphic_Calculator
- Original license: See upstream `LICENSE`; keep attribution and license intact
- Upstream issue targeted: https://github.com/belelaritra/Neumorphic_Calculator/issues/20
- Student: Davante
- Branch: `flutter-gems-calculator-demo` of `Davante21/First-app`

## What changed?

**Visible change:** A `DAVANTE | FLUTTER DEMO` label appears in the calculation display.

**Proposed bug fix:** After completing `9 × 9 = 81`, pressing `5` starts a new expression rather than appending the 5 to 81. Pressing an operator still allows continued arithmetic with the result.

## How to run locally

The upstream project uses **Dart 2** (`sdk: ">=2.12.0 <3.0.0"`). Flutter **3.3.10** is a reasonable compatibility attempt, not a verified working version.

```bash
git clone https://github.com/belelaritra/Neumorphic_Calculator.git
cd Neumorphic_Calculator
flutter pub get
flutter run
```

To customize, copy the two files from this branch's
`flutter_gems_calculator/overrides/lib/` folder to the matching paths in the cloned app.

## GitHub Actions recording attempt

The workflow `.github/workflows/flutter-gems-calculator.yml` attempts to clone the original repository and record original and customized versions using a real Android emulator. The repository's old dependencies might prevent the build.

**Do not describe videos as completed or a bug as reproduced unless the workflow actually succeeds and the frames show the intended behavior.** This branch is not an actual GitHub fork of the upstream repository; it contains an attributed customization and a CI recording workflow.

Suggested submission videos: original running, visible customization, issue reproduction (optional), issue fixed (optional). The optional bug recordings require careful manual verification.
