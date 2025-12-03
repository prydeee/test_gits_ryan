<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Author;
use App\Models\Publisher;
use App\Models\Book;
use Faker\Factory as Faker;

class BookCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $publishers = [];
        for ($i = 1; $i <= 20; $i++) {
            $publishers[] = Publisher::create([
                'name'             => $faker->unique()->company . ' Publisher',
                'city'             => $faker->city,
                'established_year' => $faker->year,
            ]);
        }

        $authors = [];
        foreach ([
            'Pramoedya Ananta Toer', 'Tere Liye', 'Andrea Hirata', 'Dee Lestari', 'Eka Kurniawan',
            'Leila S. Chudori', 'Ahmad Fuadi', 'Habiburrahman El Shirazy', 'Gola Gong', 'Raditya Dika',
            'W.S. Rendra', 'Chairil Anwar', 'Sapardi Djoko Damono', 'Maan Abdul', 'Boy Candra',
            'Seno Gumira Ajidarma', 'Ayu Utami', 'N.H. Dini', 'Mira W.', 'Windhy Puspitadewi'
        ] as $name) {
            $authors[] = Author::create([
                'name'        => $name,
                'birth_date'  => $faker->date('Y-m-d', '2000-01-01'),
                'nationality' => 'Indonesia',
                'biography'   => $faker->paragraph(3),
            ]);
        }

        for ($i = count($authors); $i < 30; $i++) {
            $authors[] = Author::create([
                'name'        => $faker->unique()->name,
                'birth_date'  => $faker->date('Y-m-d', '1990-01-01'),
                'nationality' => $faker->randomElement(['Indonesia', 'Malaysia', 'Singapore', 'USA', 'UK']),
                'biography'   => $faker->paragraph(3),
            ]);
        }

        $titles = [
            'Laskar Pelangi', 'Bumi Manusia', 'Ayat-Ayat Cinta', 'Negeri 5 Menara', 'Perahu Kertas',
            'Cantik Itu Luka', 'Orang-Orang Bloomington', 'Sang Pemimpi', 'Dilan 1990', 'Milea',
            'Ronggeng Dukuh Paruk', 'Gadis Pantai', 'Laut Bercerita', 'Pulang', 'Daun yang Jatuh',
            'Rectoverso', 'Supernova', 'Madre', 'Orang Miskin Dilarang Sekolah', 'Filosofi Kopi'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $author = $faker->randomElement($authors);
            $publisher = $faker->randomElement($publishers);

            Book::create([
                'title'          => $i <= 20 ? $titles[$i - 1] . " " . $faker->sentence(2) : $faker->sentence(4),
                'isbn'           => $faker->unique()->isbn13,
                'published_year' => $faker->year('now'),
                'pages'          => $faker->numberBetween(100, 800),
                'synopsis'       => $faker->paragraphs(3, true),
                'author_id'      => $author->id,
                'publisher_id'   => $publisher->id,
            ]);
        }

        $bestAuthors = Author::whereIn('name', ['Pramoedya Ananta Toer', 'Tere Liye', 'Andrea Hirata'])->get();
        foreach ($bestAuthors as $author) {
            Book::create([
                'title'          => $author->name . ": Karya Terbaik Sepanjang Masa",
                'isbn'           => $faker->unique()->isbn13,
                'published_year' => 2024,
                'pages'          => $faker->numberBetween(300, 600),
                'synopsis'       => "Kumpulan karya terbaik dari {$author->name} yang melegenda.",
                'author_id'      => $author->id,
                'publisher_id'   => $publishers[0]->id,
            ]);
        }
    }
}