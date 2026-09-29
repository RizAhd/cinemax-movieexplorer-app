import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

export function findTrailer(videos) {
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube');

  return (
    youtubeVideos.find((video) => video.type === 'Trailer') ||
    youtubeVideos.find((video) => video.type === 'Teaser')
  );
}

function TrailerEmbed({ videos }) {
  const trailer = findTrailer(videos);

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
