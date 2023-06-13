figma.showUI(__html__, {width: 250, height: 350});

figma.ui.onmessage = msg => {
    if (msg.type === 'create-bars') {
        const { strokeSize, gap, alignment, minHeightFactor, maxHeightFactor, strokeCap } = msg;
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

        const bars = generateRandomBars(strokeSize, gap, frame, alignment, minHeightFactor, maxHeightFactor, strokeCap);

        bars.forEach(bar => frame.appendChild(bar));

        figma.notify('Sound bar visualization created!');
    }
};

function generateRandomBars(strokeSize: number, gap: number, frame: FrameNode, alignment: string, minHeightFactor: number, maxHeightFactor: number, strokeCap: string): LineNode[] {
    const bars: LineNode[] = [];
    console.log(minHeightFactor);
    console.log(maxHeightFactor);
    const minHeight = minHeightFactor * frame.height; // Adjust this value to change the lower limit
    const heightRange = (maxHeightFactor - minHeightFactor) * frame.height; // Adjust the range based on the minimum height
    const heightOffset = frame.height / 2;

    for (let xPos = strokeSize + gap; xPos < frame.width; xPos += strokeSize + gap) {
        // Random height between minHeight and (minHeight + heightRange)
        const barHeight = minHeight + Math.random() * heightRange;
        const yPos = alignment === "center" ? heightOffset + barHeight / 2 : frame.height;

        const bar = figma.createLine();
        bar.resize(barHeight, 0);
        bar.x = xPos;
        bar.y = yPos;
        bar.rotation = 90;
        bar.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        bar.strokeWeight = strokeSize;
        bar.strokeCap = strokeCap === "ROUND" ? "ROUND" : "SQUARE";

        bars.push(bar);
    }

    return bars;
}
