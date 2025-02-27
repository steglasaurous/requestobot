<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Game {
  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column]
  private int $id;

  #[ORM\Column]
  private string $name;

  #[ORM\Column]
  private string $displayName;

  #[ORM\Column]
  private string $setGameName;

  #[ORM\Column]
  private string $twitchCategoryId;

  #[ORM\Column]
  private ?string $coverArtUrl;

}
