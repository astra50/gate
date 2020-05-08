<?php

declare(strict_types=1);

namespace App\Application\Gate\Request;

use App\Domain\User\UserId;

/**
 * @psalm-immutable
 */
final class OpenRequestCommand
{
    public UserId $userId;

    public function __construct(UserId $userId)
    {
        $this->userId = $userId;
    }
}
