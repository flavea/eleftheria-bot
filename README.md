
Bot untuk server discord eleftheria. Commands dengan eksekusi rumit akan dibuat di folder `commands` sementara untuk commands sederhana dapat dibuat di [admin](https://rp.prosa.id/admin). Untuk admin dibuat menggunakan [strapi](https://strapi.io/) (link github menyusul, ehe). Bot dibuat menggunakan nodejs. Untuk pertanyaan silahkan ajukan ke discord @onyourleft#5497

# Menjalankan Bot

1. install node dan npm, untuk cara menginstallnya bisa membaca di [sini](https://nodejs.org/en/download/)
2. download atau clone repository ini, jika didownload silahkan ekstrak zip yang sudah didownload.
3. ubah nama file `.env.sample` menjadi `.env`
4. sesuaikan data yang ada di file itu contoh masukan username dan password di FORUM_USERNAME dan FORUM_PASSWORD
5. untuk kode API youtube, silahkan buat sendiri melalui google developers console
6. untuk token bot, silahkan mengikuti tahap berikut:

> 	1. Buat aplikasi discord terlebih dahulu dengan mengunjungi https://discordapp.com/developers/
> 	2. copy client secret yang ada di gambar di bawah dan copy ke file .env tapi, di bagian BOT_TOKEN= 	![enter image description
> here](https://i.ibb.co/jD7BK2b/Screenshot-from-2019-10-15-02-00-41.png)
> 	3. untuk menambahkan bot ke server kalian, di halaman developer bot yang sudah kalian buat, pergi ke menu oauth2 dan gunakan link di yang
> ada di bagian bawah untuk mengundang bot ke server 	![enter image
> description here](https://i.ibb.co/0qdKyVP/bott.png)

5. Setelah selesai melakukan set variable di file .env, buka terminal (linux/mac) atau command (windows), pergi ke folder tempat kalian menyimpan folder bot menggunakan `cd` 
6. Jalankan `npm install` dan kemudian `npm run dev`
7. Jika berhasil, maka bot akan online di server kalian

# Menjalankan Website

Repositori ini juga memiliki kode untuk [website database eleftheria.](https://eleftheria.prosa.id). Untuk mengembangkan dan menjalankannya, silahkan ubah file di folder `public`. Website masih dalam bentuk html dan js biasa.

Untuk servernya, silahkan otak-atik file `app.js`. Server dijalankan menggunakan [expressjs](https://expressjs.com/).

Untuk menjalankan website, sama seperti menjalankan bot, pergi ke folder bot di terminal dan kemudian jalankan command `npm run app-dev` dan website akan dapat di akses melalui browser melalui `localhost:8080`

# Fungsi lain

Jika ingin mengetes PvP di terminal, silahkan jalankan `node pvp.js <id1> <id2>` contoh: `node pvp.js 136 135`

Jika ingin mengupdate data pekemah di database, silahkan jalankan `node fetch.js`