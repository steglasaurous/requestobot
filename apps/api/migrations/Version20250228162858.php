<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250228162858 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE song (id SERIAL NOT NULL, game_id INT NOT NULL, song_hash VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, artist VARCHAR(255) DEFAULT NULL, mapper VARCHAR(255) NOT NULL, duration INT DEFAULT NULL, bpm DOUBLE PRECISION DEFAULT NULL, download_url VARCHAR(255) DEFAULT NULL, cover_art_url VARCHAR(255) DEFAULT NULL, file_reference VARCHAR(255) DEFAULT NULL, data_signature VARCHAR(255) NOT NULL, created_on TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_on TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_33EDEEA1E48FD905 ON song (game_id)');
        $this->addSql('CREATE INDEX IDX_33EDEEA12B36786B159968738B5A4E4 ON song (title, artist, mapper)');
        $this->addSql('ALTER TABLE song ADD CONSTRAINT FK_33EDEEA1E48FD905 FOREIGN KEY (game_id) REFERENCES game (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE song DROP CONSTRAINT FK_33EDEEA1E48FD905');
        $this->addSql('DROP TABLE song');
    }
}
