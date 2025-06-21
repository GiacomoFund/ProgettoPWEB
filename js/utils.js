export function sliderToDamping(sliderValue) {
    const min = 0.001;
    const max = 1;
    const scale = sliderValue / 1000;
    // Esponenziale: min * (max/min)^scale
    return min * Math.pow(max / min, scale);
}

export function dampingToSlider(dampingValue) {
    const min = 0.001;
    const max = 1;
    // Inversa dell'esponenziale
    const scale = Math.log(dampingValue / min) / Math.log(max / min);
    return Math.round(scale * 1000);
}
