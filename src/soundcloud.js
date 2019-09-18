const SC = require("node-soundcloud");

const { SOUND_CLOUD_CLIENT_ID } = process.env;

SC.init({ id: SOUND_CLOUD_CLIENT_ID });

exports.searchSongs = params => {
  const query = encodeURIComponent(`${params.name} ${params.artist}`); //.replace(String.fromCharCode(RIGHT_SINGLE_QUOTATION_CODE), "'");
  console.log(query);

  return new Promise((resolve, reject) => {
    SC.get(
      "/tracks",
      {
        q: query
      },
      (err, tracks = []) => {
        if (err) {
          reject(err);
        }

        resolve(tracks.map(track => track.permalink_url));
      }
    );
  });
};
