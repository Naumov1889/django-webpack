function requireAll(r) { r.keys().forEach(r); }

import './styles/index.pcss'

if (process.env.NODE_ENV !== 'production') {
   requireAll(require.context('./', false, /\.pug$/));
}


requireAll(require.context('./js', true, /\.js$/));
