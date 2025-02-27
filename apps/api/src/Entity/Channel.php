<?php
namespace App\Entity;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\ORM\Mapping as ORM;
enum ChatServiceName: string {
  case Twitch = 'twitch';
}


#[ORM\Entity]
#[ApiResource(operations: [
  new Get()
])]
class Channel {

  #[ORM\Id]
  #[ORM\GeneratedValue]
  #[ORM\Column]
  private int $id;

  #[ORM\Column]
  private string $channelName;

  #[ORM\Column]
  private ChatServiceName $chatServiceName;

  #[ORM\Column]
  private bool $inChannel;

  #[ORM\Column]
  private bool $enabled;

  #[ORM\Column]
  private \DateTime $joinedOn;

  #[ORM\Column]
  private bool $queueOpen;

  #[ORM\Column]
  private ?\DateTime $leftOn;

  #[ORM\Column]
  private string $lang;

  #[ORM\ManyToOne(targetEntity: Game::class)]
  private Game $game;

  public function getId(): int
  {
    return $this->id;
  }

  public function setId(int $id): Channel
  {
    $this->id = $id;
    return $this;
  }

  public function getChannelName(): string
  {
    return $this->channelName;
  }

  public function setChannelName(string $channelName): Channel
  {
    $this->channelName = $channelName;
    return $this;
  }

  public function getChatServiceName(): ChatServiceName
  {
    return $this->chatServiceName;
  }

  public function setChatServiceName(ChatServiceName $chatServiceName): Channel
  {
    $this->chatServiceName = $chatServiceName;
    return $this;
  }

  public function isInChannel(): bool
  {
    return $this->inChannel;
  }

  public function setInChannel(bool $inChannel): Channel
  {
    $this->inChannel = $inChannel;
    return $this;
  }

  public function isEnabled(): bool
  {
    return $this->enabled;
  }

  public function setEnabled(bool $enabled): Channel
  {
    $this->enabled = $enabled;
    return $this;
  }

  public function getJoinedOn(): \DateTime
  {
    return $this->joinedOn;
  }

  public function setJoinedOn(\DateTime $joinedOn): Channel
  {
    $this->joinedOn = $joinedOn;
    return $this;
  }

  public function isQueueOpen(): bool
  {
    return $this->queueOpen;
  }

  public function setQueueOpen(bool $queueOpen): Channel
  {
    $this->queueOpen = $queueOpen;
    return $this;
  }

  public function getLeftOn(): ?\DateTime
  {
    return $this->leftOn;
  }

  public function setLeftOn(?\DateTime $leftOn): Channel
  {
    $this->leftOn = $leftOn;
    return $this;
  }

  public function getLang(): string
  {
    return $this->lang;
  }

  public function setLang(string $lang): Channel
  {
    $this->lang = $lang;
    return $this;
  }

  public function getGame(): Game
  {
    return $this->game;
  }

  public function setGame(Game $game): Channel
  {
    $this->game = $game;
    return $this;
  }


}
