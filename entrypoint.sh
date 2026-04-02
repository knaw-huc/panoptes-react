#!/bin/sh

for file in /usr/share/nginx/html/assets/index*.js; do
  if [ ! -f $file.tmpl.js ]; then
    cp $file $file.tmpl.js
  fi

  envsubst '$VITE_PANOPTES_URL,$VITE_PANOPTES_IS_EMBEDDED,$VITE_PANOPTES_SEARCH_PATH,$VITE_PANOPTES_DETAIL_PATH,$VITE_PANOPTES_DATASET,$VITE_PANOPTES_THEME' <$file.tmpl.js >$file
done

nginx -g 'daemon off;'