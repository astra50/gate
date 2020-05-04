<?php

declare(strict_types=1);

namespace App\Domain\User;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Serializable;
use function serialize;
use Symfony\Component\Security\Core\User\EquatableInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use function unserialize;

/**
 * @ORM\Entity
 * @ORM\Table(name="users")
 */
class User implements UserInterface, EquatableInterface, Serializable
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="uuid", unique=true)
     */
    private UuidInterface $id;

    /**
     * @Assert\Email
     * @Assert\NotBlank
     *
     * @ORM\Column(unique=true)
     */
    private string $username;

    /**
     * @ORM\Column(type="json")
     */
    private array $roles;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private DateTimeImmutable $createdAt;

    public function __construct(string $username, array $roles)
    {
        $this->id = Uuid::uuid6();
        $this->roles = $roles;
        $this->username = $username;
        $this->createdAt = new DateTimeImmutable();
    }

    public function toId(): UuidInterface
    {
        return $this->id;
    }

    public function getPassword(): ?string
    {
        return null;
    }

    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function getRoles(): array
    {
        return $this->roles;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function eraseCredentials(): void
    {
    }

    public function isEqualTo(UserInterface $right): bool
    {
        if (!$right instanceof self) {
            return false;
        }

        $left = $this;

        if ($right->getUsername() !== $left->getUsername()) {
            return false;
        }

        if ($right->getRoles() !== $left->getRoles()) {
            return false;
        }

        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function serialize(): string
    {
        return serialize([
            $this->id,
            $this->username,
            $this->roles,
        ]);
    }

    /**
     * @param string $serialized
     */
    public function unserialize($serialized): void
    {
        [
            $this->id,
            $this->username,
            $roles,
        ] = unserialize($serialized, ['allowed_classes' => true]);

        $this->roles = $roles ?? [];
    }
}
