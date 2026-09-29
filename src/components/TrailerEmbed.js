import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

// Finds the best video to show from the list of TMDb videos.
// Returns the video, or undefined if there is none.
export function findTrailer(videos) {
  // Only YouTube videos can be embedded
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube');

  // Prefer a real trailer, and use a teaser if there is no trailer
  return (
    youtubeVideos.find((video) => video.type === 'Trailer') ||
    youtubeVideos.find((video) => video.type === 'Teaser')
  );
}

// Shows the YouTube trailer of a movie.
// videos = the list of videos from TMDb (each has site, type and key)
function TrailerEmbed({ videos }) {
  const trailer = findTrailer(videos);

  // No trailer: show a dashed box with an icon
  if (!trailer) {
    return (
      <Box
        sx={{
          maxWidth: 800,
          py: 5,
          textAlign: 'center',
          borderRadius: '20px',
          border: '2px dashed',
          borderColor: 'divider',
        }}
      >
        <VideocamOffIcon sx={{ fontSize: 40 }} color="disabled" />
        <Typography color="text.secondary">No trailer available for this movie.</Typography>
      </Box>
    );
  }

  return (
    // The frame: rounded corners and a shadow. It keeps the video in a 16:9 shape at any width.
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        aspectRatio: '16 / 9',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: 6,
        bgcolor: 'black',
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${trailer.key}`}
        title={trailer.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    </Box>
  );
}

export default TrailerEmbed;
