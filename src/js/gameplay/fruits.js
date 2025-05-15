import Wave from "./wave";

// holder to store the fruits
let wave;

export default () => {
        // iterate through the dudes and update their position
        if(!wave) {
            wave = new Wave();
        }
        if(!wave.isActive) {
            wave.clean();
            wave = new Wave();
        }
        return wave;
}