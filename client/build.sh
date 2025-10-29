echo "Exporting Expo application to Web version..."
bunx expo export --platform web > output.txt 2>&1 &

PID=$!

while kill -0 $PID 2>/dev/null; do
    if grep -q "Exported: dist" output.txt; then
        rm -rf output.txt
        kill $PID
        break
    fi
    sleep 1
done
