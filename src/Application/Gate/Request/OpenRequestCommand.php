<?php

declare(strict_types=1);

namespace App\Application\Gate\Request;

use App\Domain\User\UserId;
use Ramsey\Uuid\UuidInterface;

/**
 * @psalm-immutable
 */
final class OpenRequestCommand
{
    public UserId $userId;
    public UuidInterface $gateId;

    public function __construct(UserId $userId, UuidInterface $gateId)
    {
        $this->userId = $userId;
        $this->gateId = $gateId;
    }
}
