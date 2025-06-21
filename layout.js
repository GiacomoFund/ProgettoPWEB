import { nodes, edges, NODE_RADIUS, setSimulationPaused } from './graph.js';
import { drawGraph } from './draw.js';

export let frLayoutActive = false;
let frLayoutState = null;
let fruchtermanInterval = null;

export function fruchtermanReingoldLayout(iterations = 200) {
    if (nodes.length === 0 || frLayoutActive) return;
    setSimulationPaused(true);

    const canvas = document.getElementById("canvas");
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    const area = width * height;
    const k = Math.sqrt(area / nodes.length);

    const margin = NODE_RADIUS * 1;
    const minX = margin, maxX = width - margin;
    const minY = margin, maxY = height - margin;

    frLayoutState = {
        iterations,
        k,
        minX,
        maxX,
        minY,
        maxY,
        nodes,
        edges,
        temperature: width / 10,
        currentIter: 0,
        slowSteps: 20, // Quanti passi lenti vuoi
        mediuSteps: 50, // Quanti passi medi
        fastInterval: 10,  // ms per i passi veloci
        mediumInterval: 50, // ms per i passi medi
        slowInterval: 100 // ms per i passi lenti
    };

    frLayoutActive = true;
    const optimizeBtn = document.getElementById("optimizeBtn");
    if (optimizeBtn) optimizeBtn.textContent = "⏳ Ottimizzazione in corso...";

    fruchtermanInterval = setInterval(fruchtermanReingoldStep, frLayoutState.slowInterval);
}

function fruchtermanReingoldStep() {
    if (!frLayoutActive || !frLayoutState) return;
    const {iterations, k, minX, maxX, minY, maxY, nodes, edges} = frLayoutState;

    nodes.forEach(n => {
        n.fr_dx = 0;
        n.fr_dy = 0;
    });

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.hypot(dx, dy) || 0.01;
            const force = (k * k) / dist;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].fr_dx += fx;
            nodes[i].fr_dy += fy;
            nodes[j].fr_dx -= fx;
            nodes[j].fr_dy -= fy;
        }
    }

    edges.forEach(edge => {
        const n1 = nodes[edge.from];
        const n2 = nodes[edge.to];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        // Lunghezza ideale dell'arco (puoi regolare la formula)
        const desired = (40 + edge.weight * 10);
        // Forza attrattiva proporzionale alla differenza tra distanza attuale e desiderata
        const force = ((dist - desired) * dist) * 10 / k;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        n1.fr_dx -= fx;
        n1.fr_dy -= fy;
        n2.fr_dx += fx;
        n2.fr_dy += fy;
    });

    let temperature = frLayoutState.temperature;
    nodes.forEach(n => {
        const dx = n.fr_dx;
        const dy = n.fr_dy;
        const disp = Math.hypot(dx, dy) || 0.01;
        // Applica la massa: accelerazione = forza / massa
        n.x += ((dx / disp) * Math.min(temperature, disp)) * 10 / n.massa;
        n.y += ((dy / disp) * Math.min(temperature, disp)) * 10 / n.massa;
    });

    frLayoutState.temperature *= 0.97;
    frLayoutState.currentIter++;



    drawGraph();

    // Cambio velocità dopo i primi passi
    if (frLayoutState.currentIter === frLayoutState.slowSteps) {
        clearInterval(fruchtermanInterval);
        fruchtermanInterval = setInterval(fruchtermanReingoldStep, frLayoutState.mediumInterval);
    }
    if (frLayoutState.currentIter === frLayoutState.mediuSteps) {
        clearInterval(fruchtermanInterval);
        fruchtermanInterval = setInterval(fruchtermanReingoldStep, frLayoutState.fastInterval);
    }

    if (frLayoutState.currentIter >= frLayoutState.iterations) {
        clearInterval(fruchtermanInterval);
        frLayoutActive = false;
        frLayoutState = null;
        nodes.forEach(n => { n.vx = 0; n.vy = 0; });
        const optimizeBtn = document.getElementById("optimizeBtn");
        if (optimizeBtn) optimizeBtn.textContent = "⚡ Layout Ottimale";
        setSimulationPaused(false);

        centerAndScaleGraph(nodes, canvas, NODE_RADIUS * 5);

        drawGraph();
    }
}

function centerAndScaleGraph(nodes, canvas, margin = NODE_RADIUS * 5) {
    // Calcola bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let n of nodes) {
        if (n.x < minX) minX = n.x;
        if (n.x > maxX) maxX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.y > maxY) maxY = n.y;
    }
    const width = canvas.width;
    const height = canvas.height;
    const targetWidth = width - 2 * margin;
    const targetHeight = height - 2 * margin;

    const scaleX = targetWidth / (maxX - minX || 1);
    const scaleY = targetHeight / (maxY - minY || 1);
    const scale = Math.min(scaleX, scaleY);

    // Scala rispetto al bounding box
    nodes.forEach(n => {
        n.x = (n.x - minX) * scale + margin;
        n.y = (n.y - minY) * scale + margin;
    });

    // Centra il bounding box nel canvas
    let newMinX = Math.min(...nodes.map(n => n.x));
    let newMaxX = Math.max(...nodes.map(n => n.x));
    let newMinY = Math.min(...nodes.map(n => n.y));
    let newMaxY = Math.max(...nodes.map(n => n.y));
    const offsetX = (width - (newMaxX - newMinX)) / 2 - newMinX;
    const offsetY = (height - (newMaxY - newMinY)) / 2 - newMinY;

    nodes.forEach(n => {
        n.x += offsetX;
        n.y += offsetY;
    });
}