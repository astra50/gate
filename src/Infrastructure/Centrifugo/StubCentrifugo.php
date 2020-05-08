<?php

declare(strict_types=1);

namespace App\Infrastructure\Centrifugo;

use App\Domain\User\UserId;

final class StubCentrifugo implements Centrifugo
{
    public function generateConnectionToken(
        UserId $userId,
        int $exp = 0,
        array $info = [],
        array $channels = []
    ): string {
        return 'connectionToken';
    }

    public function publish(string $channel, array $data): void
    {
    }
}
