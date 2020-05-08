<?php

declare(strict_types=1);

namespace App\Application\Gate\Open;

use App\Domain\Gate\OpenRequestId;

/**
 * @psalm-immutable
 */
final class OpenCommand
{
    public OpenRequestId $requestId;

    public function __construct(OpenRequestId $requestId)
    {
        $this->requestId = $requestId;
    }
}
