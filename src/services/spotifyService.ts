// Spotify API service
// We will add functions here to call the RapidAPI Spotify endpoints

const RAPIDAPI_KEY = '746b59aad4msh2c19312de454570p12b4e3jsn7cfea6992698';
const RAPIDAPI_HOST = 'spotify23.p.rapidapi.com';

export const searchTrack = async (type: string) => {
  const url = `https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5`;
  const options = {
    method : 'GET', 
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok)  {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching search result:', error)
    throw error;
  }
}

// Example for track_lyrics from your cURL
export const getTrackLyrics = async (trackId: string) => {
  const url = `https://spotify23.p.rapidapi.com/track_lyrics/?id=${trackId}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching track lyrics:', error);
    throw error;
  }
};

export const getPlaylist = async (playlistId: string) => {
  const url = `https://spotify23.p.rapidapi.com/playlist/?id=${playlistId}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};


export const getTrackPreview = async (trackId: string) => {
  const url = `https://spotify23.p.rapidapi.com/tracks/?ids=${trackId}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.tracks[0]?.preview_url;
  } catch (error) {
    console.error('Error fetching track preview:', error);
    throw error;
  }
};


