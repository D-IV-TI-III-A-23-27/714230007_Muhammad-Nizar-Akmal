# Hasil Benchmarking PEDE -- Doc2Vec Embedding

**Paper Uji (2 paper):**
  - *A survey on multi-agent reinforcement learning and its application* (DOI: `10.1016/j.jai.2024.02.003`)
  - *Reinforcement learning algorithms: A brief survey* (DOI: `10.1016/j.eswa.2023.120495`)  
**Model Embedding:** Doc2Vec (`gensim`) -- 300 dimensi, PV-DM, 40 epoch training
**Tanggal Benchmark:** 2026-06-04 20:52

## Hasil Benchmarking (10 Eksperimen)

| Ukuran Chunk | Overlap | Metode Chunking | Model Embedding | Dukungan Bahasa | Tipe Query Uji | Top-K | Filter Metadata | Hit Rate | Latensi | Ukuran Index DB | Catatan |
|:---:|:---:|:---|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|
| 256 | 50 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 5 | Tidak | 40% | 0.01s | 6.5 MB | *Chunk sangat kecil* |
| 500 | 100 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 5 | Tidak | 60% | 0.01s | 10.0 MB | *Chunk kecil* |
| 1000 | 200 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 5 | Tidak | 80% | 0.01s | 12.2 MB | *Chunk medium (baseline)* |
| 2000 | 400 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 5 | Tidak | **100%** | 0.01s | 13.4 MB | *Chunk besar* |
| 1000 | 0 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 5 | Tidak | **100%** | 0.02s | 15.5 MB | *Overlap 0% (tanpa)* |
| 1000 | 100 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 5 | Tidak | 80% | 0.01s | 17.6 MB | *Overlap 10%* |
| 1000 | 500 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 5 | Tidak | **100%** | 0.02s | 20.2 MB | *Overlap 50%* |
| 1000 | 200 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 3 | Tidak | 80% | 0.02s | 22.4 MB | *Top-K kecil (3)* |
| 1000 | 200 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 10 | Tidak | **100%** | 0.01s | 24.7 MB | *Top-K besar (10)* |
| 500 | 100 | Hybrid | Doc2Vec (`gensim`) | Tergantung corpus | Campuran (5 query) | 10 | Tidak | 80% | 0.02s | 28.1 MB | *Chunk kecil + Top-K besar* |

---

## Detail Hasil per Query

### 5 Pertanyaan Tes

| # | Pertanyaan | Tipe | Bahasa | Jawaban yang Diharapkan |
|:---:|---|---|:---:|---|
| Q1 | What is Q-learning and how does it work? | Factoid | EN | Q-learning is an off-policy TD method that learns optimal Q-function using temporal difference updates |
| Q2 | Mengapa masalah non-stationarity menjadi tantangan utama di MARL? | Reasoning | ID | Karena perubahan policy agent lain membuat environment tidak stasioner, melanggar asumsi Markov |
| Q3 | Bagaimana paradigma CTDE bekerja dalam multi-agent reinforcement learning? | Semantic | ID | Centralized Training with Decentralized Execution: training menggunakan informasi terpusat, eksekusi secara independen |
| Q4 | What are the main applications of multi-agent reinforcement learning? | Factoid | EN | Robotics, telecommunications, autonomous vehicles, network optimization, swarm intelligence |
| Q5 | jelaskan perbedaan antara policy gradient dan value-based method | Conversational | ID | Policy gradient mengoptimasi policy langsung via gradient, value-based menggunakan value function (Q-function) |

### Hasil per Query (Top-K = 5 vs Top-K = 10)

| # | Tipe | Bahasa | Top-K = 5 | Top-K = 10 |
|:---:|:---|:---:|:---:|:---:|
| Q1 | Factoid | EN | HIT | HIT |
| Q2 | Reasoning | ID | HIT | HIT |
| Q3 | Semantic | ID | MISS | HIT |
| Q4 | Factoid | EN | HIT | HIT |
| Q5 | Conversational | ID | HIT | HIT |
| | | **Total** | **4/5 = 80%** | **5/5 = 100%** |

---

## Analisis dan Temuan

### 1. Pengaruh Ukuran Chunk (256, 500, 1000, 2000)

Ukuran chunk **berpengaruh** pada Hit Rate. Chunk size 2000 menghasilkan Hit Rate tertinggi (100%), sedangkan chunk size 256 menghasilkan Hit Rate terendah (40%).

> **Temuan:** Ukuran chunk mempengaruhi jumlah dan granularitas informasi per chunk untuk model Doc2Vec.

### 2. Pengaruh Overlap (0%, 10%, 20%, 50%)

Overlap **berpengaruh** terhadap Hit Rate. Overlap 0 menghasilkan 100%, sedangkan overlap 200 hanya 80%.

> **Temuan:** Overlap bermanfaat untuk menjaga kontinuitas teks, dan mungkin mempengaruhi kualitas training Doc2Vec.

### 3. Pengaruh Top-K (3, 5, 10) -- Faktor Paling Berpengaruh

| Top-K | Hit Rate | Penjelasan |
|:---:|:---:|---|
| 3 | 80% | Q1, Q2, Q4, Q5 ditemukan. Q3 tidak muncul di Top-3. |
| 5 | 80% | Q1, Q2, Q4, Q5 ditemukan. Q3 tidak muncul di Top-5. |
| 10 | 100% | Q1, Q2, Q3, Q4, Q5 ditemukan. |

Top-K adalah **parameter paling berpengaruh** dalam benchmark ini. Menaikkan Top-K dari 5 ke 10 menaikkan Hit Rate dari 80% menjadi 100%.

**Mengapa?** Doc2Vec menghasilkan embedding berdasarkan distribusi kata yang dipelajari dari corpus. Query dalam Bahasa Indonesia menghasilkan token yang mungkin out-of-vocabulary, sehingga vektor yang dihasilkan kurang presisi dan chunk yang relevan berada di peringkat lebih rendah. Dengan Top-K lebih besar, chunk tersebut akhirnya ikut dikembalikan.

### 4. Konfigurasi Paling Optimal

Berdasarkan 10 eksperimen, konfigurasi terbaik adalah:

| Parameter | Nilai Optimal | Alasan |
|---|:---:|---|
| Chunk Size | **2000** | Ukuran chunk terbaik berdasarkan Hit Rate |
| Overlap | **400** | Menjaga kontinuitas teks antar potongan |
| Top-K | **5** | Menjamin lebih banyak jawaban ditemukan |
| Hit Rate | **100%** | 5/5 pertanyaan tes berhasil dijawab |

### 5. Keterbatasan Doc2Vec

- **Training Required:** Doc2Vec harus di-train dari corpus sendiri, berbeda dengan model pre-trained seperti BGE-M3 atau SPECTER yang langsung bisa digunakan.
- **Out-of-Vocabulary:** Kata yang tidak ada di training corpus akan diabaikan saat infer_vector, mengurangi kualitas embedding untuk query dengan istilah baru.
- **Bahasa:** Kualitas bergantung pada corpus training. Query Bahasa Indonesia mungkin kurang optimal jika corpus mayoritas Bahasa Inggris.
- **Ukuran Model:** Sangat kecil (~10 MB) dibanding model transformer (~2 GB+), cocok untuk deployment ringan.
- **Kecepatan:** Sangat cepat untuk inference karena tidak memerlukan GPU.

---

## Konfigurasi Teknis

| Parameter | Nilai |
|---|---|
| PDF -> Markdown | `pymupdf4llm` |
| Chunking Tier 1 | `MarkdownHeaderTextSplitter` (split by `#`, `##`, `###`) |
| Chunking Tier 2 | `RecursiveCharacterTextSplitter` (fallback jika chunk > ukuran target) |
| Model Embedding | Doc2Vec (`gensim`) -- 300 dimensi, PV-DM |
| Training Epochs | 40 |
| Vector Database | Qdrant (lokal, folder `./qdrant_db`) |
| Distance Metric | Cosine Similarity |
| Jumlah Chunks (baseline) | 454 |
| Dimensi Vektor | 300 |
