import { db } from "./utils/dbConnection.js";

async function seedDatabase() {
  const client = await db.connect();
  try {
    console.log("Starting database seeding...");

    // Begin transaction
    await client.query("BEGIN");

    // Create tt_tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tt_tasks (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        details TEXT,
        cid TEXT NOT NULL
      );
    `);
    console.log("Created tt_tasks table");

    // Create tt_tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tt_tags (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        tag_name VARCHAR(255) NOT NULL,
        tag_details TEXT,
        cid TEXT NOT NULL,
        rank INTEGER DEFAULT 0
      );
    `);
    console.log("Created tt_tags table");

    // Create tt_tag_links table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tt_tag_links (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        task_id INT REFERENCES tt_tasks(id) NOT NULL,
        tag_id INT REFERENCES tt_tags(id) NOT NULL,
        cid TEXT NOT NULL
      );
    `);
    console.log("Created tt_tag_links table");

    // Create index on tt_tags
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tt_tags_cid_rank_id 
      ON tt_tags (cid, rank DESC, id ASC);
    `);
    console.log("Created index idx_tt_tags_cid_rank_id");

    // Commit transaction
    await client.query("COMMIT");
    console.log("Database seeding completed successfully");
  } catch (error) {
    // Rollback on error
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    client.release();
  }
}

// run the seeding function
seedDatabase()
  .then(() => {
    console.log("Seeding finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
