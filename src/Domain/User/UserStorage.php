<?php

declare(strict_types=1);

namespace App\Domain\User;

use Ramsey\Uuid\UuidInterface;

interface UserStorage
{
    public function add(User $user): void;

    /**
     * @throws UserNotFound
     */
    public function getById(UuidInterface $uuid): User;

    /**
     * @throws UserNotFound
     */
    public function getByUsername(string $username): User;
}
