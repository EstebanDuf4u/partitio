import './voice.scss';

function Voice( {voice, nbreVoice} ) {
    if (!voice) return null;

    return (
        <span key={voice} className={`voice ${voice.toLowerCase()} ${nbreVoice === 1 ? "full" : ""} ${nbreVoice === 2 ? "haut" : ""}`}>
            {voice.toUpperCase()}
        </span>
    )
}

export default Voice;
