
export const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
    } catch (error) {
        console.log('error in play helper method', error.message);
    }
}

export const pause = async (playbackObj) => {
    try {
        return await playbackObj.setStatusAsync({ shouldPlay: false });
    } catch (error) {
        console.log('error in pause helper method', error.message);
    }
}

export const resume = async (playbackObj) => {
    try {
        return await playbackObj.playAsync();
    } catch (error) {
        console.log('error in pause helper method', error.message);
    }
}
