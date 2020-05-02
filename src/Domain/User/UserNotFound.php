<?php

declare(strict_types=1);

namespace App\Domain\User;

use DomainException;
use Ramsey\Uuid\UuidInterface;
use function sprintf;

final class UserNotFound extends DomainException
{
    public static function fromUsername(string $username): self
    {
        return new self(sprintf('User with username "%s" not found.', $username));
    }

    public static function fromUuid(UuidInterface $uuid): self
    {
        return new self(sprintf('User with uuid "%s" not found.', $uuid->toString()));
    }
}
