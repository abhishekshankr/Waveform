figma.showUI(__html__, {width: 240, height: 200});

figma.ui.onmessage = msg => {
    if (msg.type === 'create-bars') {
        const { strokeSize, gap } = msg;
        const nodes = figma.currentPage.selection;

        if (nodes.length !== 1 || nodes[0].type !== "FRAME") {
            figma.notify('Please select a single frame!');
            return;
        }

        const frame = nodes[0] as FrameNode;
        // clear the frame each time
        for (const child of frame.children) {
            child.remove();
        }

        const bars = generateRandomBars(strokeSize, gap, frame);

        bars.forEach(bar => frame.appendChild(bar));

        figma.notify('Sound bar visualization created!');
    }
};

function generateRandomBars(strokeSize: number, gap: number, frame: FrameNode): LineNode[] {
    const bars: LineNode[] = [];
    const minHeight = 0.1 * frame.height; // Adjust this value to change the lower limit
    const heightRange = 0.9 * frame.height; // Adjust the range based on the minimum height

    for (let xPos = 0; xPos < frame.width; xPos += strokeSize + gap) {
        // Random height between minHeight and (minHeight + heightRange)
        const barHeight = minHeight + Math.random() * heightRange;

        const bar = figma.createLine();
        bar.resize(barHeight, 0);
        bar.x = xPos;
        bar.y = frame.height;
        bar.rotation = 90;
        bar.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }}];
        bar.strokeWeight = strokeSize;

        bars.push(bar);
    }

    return bars;
}
