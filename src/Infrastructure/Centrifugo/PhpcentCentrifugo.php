<?php

declare(strict_types=1);

namespace App\Infrastructure\Centrifugo;

use App\Domain\User\UserId;
use phpcent\Client;

final class PhpcentCentrifugo implements Centrifugo
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function generateConnectionToken(
        UserId $userId,
        int $exp = 0,
        array $info = [],
        array $channels = []
    ): string {
        return $this->client->generateConnectionToken($userId->toString(), $exp, $info, $channels);
    }

    public function publish(string $channel, array $data): void
    {
        $this->client->publish($channel, $data);
    }
}
