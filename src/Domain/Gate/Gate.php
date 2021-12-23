<?php

declare(strict_types=1);

namespace App\Domain\Gate;

use App\Domain\User\UserId;
use Ramsey\Uuid\UuidInterface;
use Throwable;

interface Gate
{
    /**
     * @throws Throwable
     */
    public function open(OpenRequestId $requestId, UserId $userId, UuidInterface $gateId): void;
}
