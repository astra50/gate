<?php

declare(strict_types=1);

namespace App\Infrastructure;

use App\Domain\User\User;
use App\Domain\User\UserNotFound;
use App\Domain\User\UserStorage;
use Ramsey\Uuid\UuidInterface;

final class DoctrineUserStorage implements UserStorage
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    public function add(User $user): void
    {
        $this->registry->getManager()->persist($user);
        $this->registry->getManager()->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function getById(UuidInterface $uuid): User
    {
        /** @var User|null $user */
        $user = $this->registry->repository(User::class)->find($uuid);

        if (null === $user) {
            throw UserNotFound::fromUuid($uuid);
        }

        return $user;
    }

    /**
     * {@inheritdoc}
     */
    public function getByUsername(string $username): User
    {
        /** @var User|null $user */
        $user = $this->registry->repository(User::class)->findOneBy(['username' => $username]);

        if (null === $user) {
            throw UserNotFound::fromUsername($username);
        }

        return $user;
    }
}
