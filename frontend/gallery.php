<?php 
$page_title = "Gallery";
include 'includes/header.php'; 
include '../backend/db.php';

$category = isset($_GET['cat']) ? clean_input($_GET['cat']) : 'All';

$query = "SELECT * FROM gallery";
if ($category != 'All') {
    $query .= " WHERE category = '$category'";
}
$query .= " ORDER BY id DESC";
$result = $conn->query($query);
?>

<style>
.gallery-header {
    background: linear-gradient(rgba(0,35,71,0.8), rgba(0,35,71,0.8)), url('../Home page/photes/collage ground.png');
    background-size: cover;
    padding: 120px 0 60px;
    color: var(--white);
    text-align: center;
}

.gallery-filters {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 40px 0;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 10px 25px;
    border-radius: 30px;
    background: var(--bg-light);
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    border: 2px solid transparent;
    transition: var(--transition);
}

.filter-btn.active, .filter-btn:hover {
    background: var(--primary);
    color: var(--white);
    border-color: var(--secondary);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.gallery-item {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    height: 250px;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.gallery-item:hover img {
    transform: scale(1.1);
}

.gallery-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 35, 71, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
}

.gallery-item:hover .gallery-overlay {
    opacity: 1;
}

.gallery-overlay i {
    color: var(--white);
    font-size: 2rem;
}

/* Lightbox */
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    z-index: 2000;
    display: none;
    align-items: center;
    justify-content: center;
}

.lightbox-content {
    max-width: 90%;
    max-height: 85%;
    position: relative;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
}

.close-lightbox {
    position: absolute;
    top: -40px;
    right: 0;
    color: white;
    font-size: 2rem;
    cursor: pointer;
}
</style>

<section class="gallery-header">
    <div class="container">
        <h1>Campus Gallery</h1>
        <p>Glimpses of academic life, cultural events, and sporting excellence at SVES.</p>
    </div>
</section>

<div class="container section-padding">
    <div class="gallery-filters">
        <a href="gallery.php?cat=All" class="filter-btn <?php echo ($category == 'All') ? 'active' : ''; ?>">All</a>
        <a href="gallery.php?cat=Campus" class="filter-btn <?php echo ($category == 'Campus') ? 'active' : ''; ?>">Campus</a>
        <a href="gallery.php?cat=Events" class="filter-btn <?php echo ($category == 'Events') ? 'active' : ''; ?>">Events</a>
        <a href="gallery.php?cat=Cultural" class="filter-btn <?php echo ($category == 'Cultural') ? 'active' : ''; ?>">Cultural</a>
        <a href="gallery.php?cat=Sports" class="filter-btn <?php echo ($category == 'Sports') ? 'active' : ''; ?>">Sports</a>
    </div>

    <div class="gallery-grid">
        <?php if ($result && $result->num_rows > 0): ?>
            <?php while($row = $result->fetch_assoc()): ?>
                <div class="gallery-item" data-aos="zoom-in" onclick="openLightbox('../<?php echo $row['image_path']; ?>')">
                    <img src="../<?php echo $row['image_path']; ?>" alt="<?php echo $row['caption']; ?>">
                    <div class="gallery-overlay">
                        <i class="fas fa-search-plus"></i>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <p>No images found in this category.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- Simple Lightbox -->
<div id="galleryLightbox" class="lightbox" onclick="closeLightbox()">
    <div class="lightbox-content" onclick="event.stopPropagation()">
        <span class="close-lightbox" onclick="closeLightbox()">&times;</span>
        <img id="lightboxImg" src="" alt="">
    </div>
</div>

<script>
function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('galleryLightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('galleryLightbox').style.display = 'none';
}
</script>

<?php include 'includes/footer.php'; ?>
