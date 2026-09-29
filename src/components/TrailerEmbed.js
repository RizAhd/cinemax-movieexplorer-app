import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Shows the YouTube trailer of a movie.
// videos = the list of videos from TMDb (each has site, type and key)
function TrailerEmbed({ videos }) {
  // Only YouTube videos can be embedded
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube');

  // Prefer a real trailer, and use a teaser if there is no trailer
  const trailer =
    youtubeVideos.find((video) => video.type === 'Trailer') ||
    youtubeVideos.find((video) => video.type === 'Teaser');

  if (!trailer) {
    return <Typography color="text.secondary">No trailer available.</Typography>;
  }

  return (
    // This box keeps the video in a 16:9 shape at any screen width
    <Box sx={{ width: '100%', maxWidth: 720, aspectRatio: '16 / 9' }}>
      <iframe
        src={`https://www.youtube.com/embed/${trailer.key}`}
        title={trailer.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%', border: 0, borderRadius: 8 }}
      />
    </Box>
  );
}

export default TrailerEmbed;
