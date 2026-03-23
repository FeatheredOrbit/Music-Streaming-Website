import "../../styles/song_card.css";

export default function SongCard({songId, songName, artist, pathToCover, pathToSong}) {
    return (
        <div className="song-card">
            <img 
                className="song-card-cover"
                src={pathToCover ? `api/${pathToCover}` : "assets/shared/icons/main/sizes/main16x16.png"}
            />


            <div className="song-card-name"> 
                <p> {songName} </p>
            </div>
        </div>
    );

}