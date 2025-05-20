<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "song", uniqueConstraints: [new ORM\UniqueConstraint(columns: ["songHash", "game_id"])])]
#[ORM\Index(columns: ['title','artist','mapper'], options: ['fulltext'])]
class Song
{
  #[ORM\Id, ORM\Column, ORM\GeneratedValue]
  private int $id;

  #[ORM\Column]
  private string $songHash;

  #[ORM\Column]
  private string $title;

  #[ORM\Column(nullable: true)]
  private ?string $artist = null;

  #[ORM\Column]
  private string $mapper;

  #[ORM\Column(type: "integer", nullable: true)]
  private ?int $duration = null;

  #[ORM\Column(type: "float", nullable: true)]
  private ?float $bpm = null;

  #[ORM\Column(nullable: true)]
  private ?string $downloadUrl = null;

  #[ORM\Column(nullable: true)]
  private ?string $coverArtUrl = null;

  #[ORM\Column(nullable: true)]
  private ?string $fileReference = null;

  #[ORM\Column]
  private string $dataSignature;

  #[ORM\Column(type: "datetime")]
  private \DateTimeInterface $createdOn;

  #[ORM\Column(type: "datetime")]
  private \DateTimeInterface $updatedOn;

  #[ORM\ManyToOne(targetEntity: Game::class, inversedBy: "songs")]
  #[ORM\JoinColumn(nullable: false)]
  private Game $game;

//  /**
//   * @var SongRequest[]
//   */
//  #[ORM\OneToMany(mappedBy: "song", targetEntity: SongRequest::class)]
//  private iterable $requests;

  // songSearch is not included - Doctrine does not support FULLTEXT indexing or any equivalent out of the box.

  public function __construct()
  {
    $this->createdOn = new \DateTimeImmutable();
    $this->updatedOn = new \DateTimeImmutable();
    $this->requests = new \Doctrine\Common\Collections\ArrayCollection();
  }

  public function getId(): int
  {
    return $this->id;
  }

  public function getSongHash(): string
  {
    return $this->songHash;
  }

  public function setSongHash(string $songHash): Song
  {
    $this->songHash = $songHash;
    return $this;
  }

  public function getTitle(): string
  {
    return $this->title;
  }

  public function setTitle(string $title): Song
  {
    $this->title = $title;
    return $this;
  }

  public function getArtist(): ?string
  {
    return $this->artist;
  }

  public function setArtist(?string $artist): Song
  {
    $this->artist = $artist;
    return $this;
  }

  public function getMapper(): string
  {
    return $this->mapper;
  }

  public function setMapper(string $mapper): Song
  {
    $this->mapper = $mapper;
    return $this;
  }

  public function getDuration(): ?int
  {
    return $this->duration;
  }

  public function setDuration(?int $duration): Song
  {
    $this->duration = $duration;
    return $this;
  }

  public function getBpm(): ?float
  {
    return $this->bpm;
  }

  public function setBpm(?float $bpm): Song
  {
    $this->bpm = $bpm;
    return $this;
  }

  public function getDownloadUrl(): ?string
  {
    return $this->downloadUrl;
  }

  public function setDownloadUrl(?string $downloadUrl): Song
  {
    $this->downloadUrl = $downloadUrl;
    return $this;
  }

  public function getCoverArtUrl(): ?string
  {
    return $this->coverArtUrl;
  }

  public function setCoverArtUrl(?string $coverArtUrl): Song
  {
    $this->coverArtUrl = $coverArtUrl;
    return $this;
  }

  public function getFileReference(): ?string
  {
    return $this->fileReference;
  }

  public function setFileReference(?string $fileReference): Song
  {
    $this->fileReference = $fileReference;
    return $this;
  }

  public function getDataSignature(): string
  {
    return $this->dataSignature;
  }

  public function setDataSignature(string $dataSignature): Song
  {
    $this->dataSignature = $dataSignature;
    return $this;
  }

  public function getCreatedOn(): \DateTimeInterface
  {
    return $this->createdOn;
  }

  public function setCreatedOn(\DateTimeInterface $createdOn): Song
  {
    $this->createdOn = $createdOn;
    return $this;
  }

  public function getUpdatedOn(): \DateTimeInterface
  {
    return $this->updatedOn;
  }

  public function setUpdatedOn(\DateTimeInterface $updatedOn): Song
  {
    $this->updatedOn = $updatedOn;
    return $this;
  }

  public function getGame(): Game
  {
    return $this->game;
  }

  public function setGame(Game $game): Song
  {
    $this->game = $game;
    return $this;
  }

  public function getRequests(): iterable
  {
    return $this->requests;
  }

  public function setRequests(iterable $requests): Song
  {
    $this->requests = $requests;
    return $this;
  }


}
