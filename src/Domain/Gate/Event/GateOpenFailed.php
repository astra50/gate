<?php

declare(strict_types=1);

namespace App\Domain\Gate\Event;

use App\Domain\Gate\OpenRequestId;
use Ramsey\Uuid\UuidInterface;

/**
 * @psalm-immutable
 */
final class GateOpenFailed
{
    public OpenRequestId $requestId;
    public UuidInterface $gateId;

    public function __construct(OpenRequestId $requestId, UuidInterface $gateId)
    {
        $this->requestId = $requestId;
        $this->gateId = $gateId;
    }
}
