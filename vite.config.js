import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
    plugins: [
        react(),
        svgrPlugin(),
        {
            // default settings on build (i.e. fail on error)
            ...eslint({
                failOnWarning: false,
                failOnError: false,
            }),
            apply: 'build',
        },
        {
            // do not fail on serve (i.e. local development)
            ...eslint({
                failOnWarning: false,
                failOnError: false,
            }),
            apply: 'serve',
            enforce: 'post',
        },
    ],
})
