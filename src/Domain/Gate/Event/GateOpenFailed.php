<?php

declare(strict_types=1);

namespace App\Domain\Gate\Event;

use App\Domain\Gate\OpenRequestId;

/**
 * @psalm-immutable
 */
final class GateOpenFailed
{
    public OpenRequestId $requestId;

    public function __construct(OpenRequestId $requestId)
    {
        $this->requestId = $requestId;
    }
}
