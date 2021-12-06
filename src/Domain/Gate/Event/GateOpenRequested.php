<?php

declare(strict_types=1);

namespace App\Domain\Gate\Event;

use App\Domain\Gate\OpenRequestId;
use App\Domain\User\UserId;

/**
 * @psalm-immutable
 */
final class GateOpenRequested
{
    public OpenRequestId $requestId;
    public UserId $userId;

    public function __construct(OpenRequestId $requestId, UserId $userId)
    {
        $this->requestId = $requestId;
        $this->userId = $userId;
    }
}
