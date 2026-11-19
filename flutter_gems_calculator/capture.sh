#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="${GITHUB_WORKSPACE}"
UPSTREAM="${ROOT}/upstream_app"
OUT="${ROOT}/recordings"
OVERRIDES="${ROOT}/flutter_gems_calculator/overrides"
mkdir -p "${OUT}"
cd "${UPSTREAM}"
echo "Building and launching original Flutter app"
flutter pub get
adb shell wm size 360x780
adb shell wm density 320

launch_app () {
  flutter build apk --debug
  adb install -r build/app/outputs/flutter-apk/app-debug.apk
  adb shell am force-stop com.neumorphic.calculator || true
  adb shell am start -n com.neumorphic.calculator/.MainActivity
  sleep 8
}

record_clip () {
  local name="$1"
  adb shell rm -f "/sdcard/${name}.mp4"
  adb shell screenrecord --bit-rate 1250000 --time-limit 8 "/sdcard/${name}.mp4" &
  local pid=$!
  sleep 9
  wait "$pid" || true
  adb pull "/sdcard/${name}.mp4" "${OUT}/${name}.mp4"
  adb exec-out screencap -p > "${OUT}/${name}.png"
}

tap () {
  adb shell input tap "$1" "$2"
  sleep 0.7
}

demo_calculation () {
  # 360x780 emulator: columns approximately x=45,135,225,315;
  # rows approximately y=300,380,460,540,620,700.
  # Button mappings can change with layout/version; save screenshots as proof.
  tap 225 450  # 9
  tap 315 450  # *
  tap 225 450  # 9
  tap 315 700  # =
  sleep 1
  tap 135 540  # 5; bug may append to 81
  tap 315 450  # *
  tap 135 540  # 5
  sleep 1
}

launch_app
record_clip 01_original_running
echo "Original capture complete."

cp "${OVERRIDES}/lib/src/ui/calculation_display.dart" lib/src/ui/calculation_display.dart
launch_app
record_clip 02_customized_running
echo "Customization capture complete."
adb shell am force-stop com.neumorphic.calculator || true
adb shell am start -n com.neumorphic.calculator/.MainActivity
sleep 4
adb shell input tap 45 380 || true # C, if coordinate correct
demo_calculation
record_clip 03_bug_reproduction_attempt
echo "Original reported behavior capture complete, manual visual verification needed."

cp "${OVERRIDES}/lib/src/utils/button_press.dart" lib/src/utils/button_press.dart
launch_app
adb shell input tap 45 380 || true # C, if coordinate correct
demo_calculation
record_clip 04_bug_fix_attempt
echo "Bug-fix code build and capture complete; manual visual verification needed."

echo "Recordings:"
ls -lh "${OUT}"
