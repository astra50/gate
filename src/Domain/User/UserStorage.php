<?php

declare(strict_types=1);

namespace App\Domain\User;

interface UserStorage
{
    public function add(User $user): void;

    /**
     * @throws UserNotFound
     */
    public function getById(UserId $uuid): User;

    /**
     * @throws UserNotFound
     */
    public function getByUsername(string $username): User;
}
