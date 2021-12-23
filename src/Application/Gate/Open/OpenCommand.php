<?php

declare(strict_types=1);

namespace App\Application\Gate\Open;

use App\Domain\Gate\OpenRequestId;
use App\Domain\User\UserId;
use Ramsey\Uuid\UuidInterface;

/**
 * @psalm-immutable
 */
final class OpenCommand
{
    public OpenRequestId $requestId;
    public UserId $userId;
    public UuidInterface $gateId;

    public function __construct(OpenRequestId $requestId, UserId $userId, UuidInterface $gateId)
    {
        $this->requestId = $requestId;
        $this->userId = $userId;
        $this->gateId = $gateId;
    }
}
